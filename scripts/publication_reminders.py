#!/usr/bin/env python3
"""Daily reminder: find Marco's new Google Scholar papers that include a current
lab member, and email that member (closest to first author) to add the paper to
the website if it is missing from content/bibliography/ASL_Bib.bib.

Dry-run by default; pass --send to actually email.
  --init     record everything currently missing as already-seen (no emails);
             run once before enabling the daily job to avoid a flood.
  --fixture  read Scholar articles from a JSON file instead of calling SerpAPI.

Env: SERPAPI_KEY (Scholar via SerpAPI), GMAIL_USER, GMAIL_APP_PASSWORD,
     FALLBACK_EMAIL (recipient when a member has no email on their page).
"""
import argparse, datetime as dt, difflib, email, imaplib, json, os, re, smtplib, sys, unicodedata
import time, urllib.error, urllib.parse, urllib.request
from email.message import EmailMessage
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PEOPLE = ROOT / "public/_people"
BIB = ROOT / "content/bibliography/ASL_Bib.bib"
STATE = Path(__file__).resolve().parent / "publication_reminders_state.json"
REMIND_EVERY_DAYS, SINCE_YEARS = 1, 1  # remind daily until published or dismissed
DISMISS_PHRASE = "This paper does not belong on the lab website."
# Current members whose team page has no email.
EMAIL_OVERRIDES = {"xilun zhang": "xilunz@stanford.edu", "yousef liang": "youzhil@stanford.edu",
                   "zhe fu": "zhefu@stanford.edu"}


def norm(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", " ", s.lower()).strip()


def frontmatter(path):
    text = path.read_text()
    m = re.match(r"---\n(.*?)\n---", text, re.S)
    out = {}
    for line in (m.group(1).splitlines() if m else []):
        if line.lstrip().startswith("#") or ":" not in line:
            continue
        k, v = line.split(":", 1)
        out[k.strip()] = v.strip().strip('"').strip("'")
    return out


def load_roster():
    """(members, marco). Members = current PhD students and postdocs."""
    members, marco = [], None
    for f in sorted(PEOPLE.glob("*.markdown")):
        fm = frontmatter(f)
        pos = fm.get("position")
        if pos not in ("phd", "postdoc", "faculty") or not fm.get("title"):
            continue
        p = {"name": fm["title"],
             "email": fm.get("email") or EMAIL_OVERRIDES.get(norm(fm["title"])),
             "scholar": (fm.get("gscholar") or "").split("&")[0] or None,
             "last": norm(fm.get("last") or fm["title"].split()[-1])}
        p["first"] = norm(fm["title"].replace("Prof.", "").split()[0])
        if pos == "faculty":
            marco = p
        else:
            members.append(p)
    return members, marco


def is_author(person, author):
    a = norm(author).split()
    if not a:
        return False
    # Scholar format is "M Foutter" / "Marco Pavone"; compare last name + first initial.
    last = person["last"].split()[-1]
    return a[-1] == last and a[0][:1] == person["first"][:1]


def bib_titles():
    titles = re.findall(r"^\s*title\s*=\s*(.+?),?\s*$", BIB.read_text(), re.M)
    return [norm(re.sub(r"[{}]", "", t)) for t in titles]


def in_bib(title, bib):
    t = norm(title)
    return any(t == b or difflib.SequenceMatcher(None, t, b).ratio() >= 0.9 for b in bib)


def serpapi(**params):
    key = os.environ.get("SERPAPI_KEY")
    if not key:
        sys.exit("SERPAPI_KEY not set (or use --fixture)")
    params.update(api_key=key, engine="google_scholar_author")
    url = "https://serpapi.com/search.json?" + urllib.parse.urlencode(params)
    for attempt in range(3):
        try:
            with urllib.request.urlopen(url, timeout=120) as r:
                return json.load(r)
        except (TimeoutError, urllib.error.URLError):
            if attempt == 2:
                raise
            time.sleep(5)


def fetch_articles(marco_id):
    data = serpapi(author_id=marco_id, sort="pubdate", num=40, hl="en")
    return data.get("articles", [])


def full_authors(article):
    """Author strings are truncated with '...'; fetch the full list for new papers."""
    if "..." not in article.get("authors", "") or not article.get("citation_id"):
        return article.get("authors", "")
    try:
        data = serpapi(view_op="view_citation", citation_id=article["citation_id"], hl="en")
    except Exception as e:  # keep the daily run alive; fall back to the truncated list
        print(f"warn: full author lookup failed for {article.get('title')!r}: {e}", file=sys.stderr)
        return article["authors"]
    return data.get("citation", {}).get("authors", article["authors"])


def pick_recipient(authors, members):
    """Current member whose name appears earliest in the author list."""
    best = None
    for i, a in enumerate(authors):
        for m in members:
            if is_author(m, a) and (best is None or i < best[0]):
                best = (i, m)
    return best[1] if best else None


def send(msg_to, cc, subject, body):
    msg = EmailMessage()
    msg["From"], msg["To"], msg["Subject"] = os.environ["GMAIL_USER"], msg_to, subject
    if cc:
        msg["Cc"] = cc
    msg.set_content(body)
    with smtplib.SMTP("smtp.gmail.com", 587, timeout=30) as s:
        s.starttls()
        s.login(os.environ["GMAIL_USER"], os.environ["GMAIL_APP_PASSWORD"])
        s.send_message(msg)


def top_of_reply(text):
    """Only the new text of a reply: drop quoted lines and the quoted original."""
    out = []
    for line in text.splitlines():
        if line.startswith(">") or re.match(r"On .*wrote:", line.strip()):
            break
        out.append(line)
    return "\n".join(out)


def check_dismissals(state, allowed_senders):
    """Mark papers dismissed when a lab member replies with the dismissal phrase."""
    user, pw = os.environ.get("GMAIL_USER"), os.environ.get("GMAIL_APP_PASSWORD")
    if not (user and pw) or not state:
        return
    since = (dt.date.today() - dt.timedelta(days=45)).strftime("%d-%b-%Y")
    m = imaplib.IMAP4_SSL("imap.gmail.com", timeout=30)
    m.login(user, pw)
    m.select("INBOX", readonly=True)
    _, ids = m.search(None, f'(SINCE {since})')
    for i in ids[0].split():
        _, data = m.fetch(i, "(RFC822)")
        msg = email.message_from_bytes(data[0][1])
        sender = email.utils.parseaddr(msg.get("From", ""))[1].lower()
        if sender not in allowed_senders:  # ignore anyone not in the lab
            continue
        body = ""
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                body += part.get_payload(decode=True).decode(errors="ignore")
        if norm(DISMISS_PHRASE) not in norm(top_of_reply(body)):
            continue
        subj = norm(msg.get("Subject", ""))
        for key, entry in state.items():
            if key in subj and not entry.get("dismissed"):
                entry["dismissed"] = True
                print(f"DISMISSED by {sender}: {entry['title']}")
    m.logout()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--send", action="store_true")
    ap.add_argument("--init", action="store_true")
    ap.add_argument("--fixture")
    ap.add_argument("--show", action="store_true", help="print full email text")
    args = ap.parse_args()

    members, marco = load_roster()
    if not marco or not marco["scholar"]:
        sys.exit("Could not find Marco's Scholar ID in public/_people")
    articles = json.load(open(args.fixture)) if args.fixture else fetch_articles(marco["scholar"])
    bib = bib_titles()
    state = json.load(open(STATE)) if STATE.exists() else {}
    today = dt.date.today()
    min_year = today.year - SINCE_YEARS
    marco_email = os.environ.get("MARCO_EMAIL", "pavone@stanford.edu")
    if args.send and not marco_email:
        sys.exit("MARCO_EMAIL not set; refusing to send without cc'ing Marco")
    if args.send and not args.fixture:
        allowed = {m["email"].lower() for m in members if m["email"]} | {marco_email.lower()}
        check_dismissals(state, allowed)

    for art in articles:
        title = art.get("title", "")
        year = int(art["year"]) if str(art.get("year", "")).isdigit() else today.year
        key = norm(title)
        if in_bib(title, bib):
            state.pop(key, None)  # published; stop tracking
            continue
        if year < min_year:
            continue
        entry = state.get(key, {"title": title, "sent": 0, "last": None})
        if args.init:
            entry["dismissed"] = True
            state[key] = entry
            continue
        if entry.get("dismissed"):
            continue
        if entry["last"] and (today - dt.date.fromisoformat(entry["last"])).days < REMIND_EVERY_DAYS:
            continue
        authors = [a.strip() for a in full_authors(art).split(",") if a.strip()]
        who = pick_recipient(authors, members)
        if not who:
            continue  # no current PhD/postdoc on this paper
        to = who["email"] or os.environ.get("FALLBACK_EMAIL") or os.environ.get("GMAIL_USER", "")
        link = art.get("link", "")
        first = who["name"].split()[0]
        body = (f"Hi {first},\n\n"
                f"There is a publication with author list \"{', '.join(authors)}\" on Google Scholar "
                f"that isn't on the lab website:\n\n"
                f"  \"{title}\" ({year})\n  {link}\n\n"
                f"Please add it by adding a BibTeX entry to content/bibliography/ASL_Bib.bib in "
                f"https://github.com/StanfordASL/stanfordasl.github.io (a pull request is fine). "
                f"Marco is cc'd and will see these reminders until it is up.\n\n"
                f"If this paper should NOT be on the lab website, reply to this email with the phrase:\n\n"
                f"  {DISMISS_PHRASE}\n\n"
                f"Only send that if you have spoken to Marco and you both agree the paper should not "
                f"be on the lab website. Doing so stops these reminders.\n\n"
                f"This is an automated reminder (#{entry['sent'] + 1}). It repeats every day "
                f"until the paper is on the site.\n")
        subject = f"[ASL website] Publication not on the lab website: {title}"
        cc = marco_email or "MARCO_EMAIL_NOT_SET"
        note = "" if who["email"] else "  [no email on page; using fallback]"
        print(f"{'SEND' if args.send else 'DRY '}  to {who['name']} <{to}> cc {cc}: {title}{note}")
        if args.show:
            print(f"Subject: {subject}\n\n{body}\n{'-' * 60}")
        if args.send:
            send(to, marco_email, subject, body)
        entry.update(sent=entry["sent"] + 1, last=today.isoformat())
        state[key] = entry

    if args.send or args.init:
        STATE.write_text(json.dumps(state, indent=1, sort_keys=True))


if __name__ == "__main__":
    main()
