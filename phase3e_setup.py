#!/usr/bin/env python3
# Phase 3e: フッターの壊れリンク(404)修正 + 確認用 /auth-test 削除。
#  /search -> /teams , /ai -> /foot-check , /plan -> /member
# 使い方: リポジトリ直下で  python3 phase3e_setup.py  → npm run build
import pathlib, shutil
ROOT = pathlib.Path.cwd()

# 1) SiteFooter の壊れリンク修正
footer = ROOT / "src/components/SiteFooter.tsx"
s = footer.read_text(encoding="utf-8")
repl = [
    ('href: "/search"', 'href: "/teams"'),
    ('href: "/ai"', 'href: "/foot-check"'),
    ('href: "/plan"', 'href: "/member"'),
]
for old, new in repl:
    assert old in s, f"not found: {old}"
    s = s.replace(old, new, 1)
footer.write_text(s, encoding="utf-8")
print("OK: SiteFooter links fixed (/teams, /foot-check, /member)")

# 2) 確認用 /auth-test 削除
at = ROOT / "src/app/auth-test"
if at.exists():
    shutil.rmtree(at)
    print("OK: removed src/app/auth-test")
else:
    print("OK: src/app/auth-test already absent")

print("OK: Phase3e done")
