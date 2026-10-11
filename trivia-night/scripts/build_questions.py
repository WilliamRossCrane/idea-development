"""Rebuild the bundled question bank from the four legacy decks and curated additions."""
from pathlib import Path
import json
import random

ROOT = Path(__file__).resolve().parents[1]
BANKS = {name: json.loads((ROOT / 'lib' / f'{name}.json').read_text()) for name in ('general', 'one_piece', 'abbott', 'superstore')}
REJECT = [
 'highest-grossing film of all time', 'currently has the largest population',
 'longest river in the world', 'which country has the most natural lakes',
 'mockumentary-style', 'mockumentary', 'what best describes', 'how would you describe',
 'how does the show', 'what does the show', 'a common source of humor',
 'a recurring theme', 'defining trait', 'general personality trait',
 'what kind of comedic tone', 'running plot thread', 'common source of tension',
 'key element of the show', 'overall setting scale', 'what genre best describes',
 'what show format', 'characterized as', 'what role does humor',
 'a major season-long storyline', 'what personal milestone', 'what retail category',
 'what does ava do before becoming principal', 'what is gregory\'s professional background',
 'which teacher is the most tech-savvy', 'what is the name of cloud 9\'s mascot',
 'how is the relationship', 'what does jonah\'s character arc',
 'how does amy\'s career', 'what personality trait', 'how does sandra',
 'how is jeff generally', 'what tone does the show',
]
for name, bank in BANKS.items():
    BANKS[name] = [q for q in bank if not any(s in q['text'].lower() for s in REJECT)]
seen = {name: {q['text'].casefold() for q in bank} for name, bank in BANKS.items()}
for i, row in enumerate((ROOT / 'scripts/extra_questions.txt').read_text().splitlines()):
    deck, category, question, *options = row.split('|')
    if len(options) != 4 or deck not in BANKS:
        raise ValueError(f'Invalid question on line {i + 1}')
    question = question.replace('What is the name of the dragon voiced by Eddie Murphy in Shrek?', 'Which character in Shrek is voiced by Eddie Murphy?')
    if question.casefold() in seen[deck]:
        continue
    correct = options[0]
    random.Random(i + 39291).shuffle(options)
    BANKS[deck].append({'deck': deck, 'category': category, 'text': question, 'options': options, 'answer': options.index(correct)})
    seen[deck].add(question.casefold())
(ROOT / 'lib/questions.mjs').write_text('export const BANKS = ' + json.dumps(BANKS, ensure_ascii=False) + ';\n')
print({name: len(bank) for name, bank in BANKS.items()})
