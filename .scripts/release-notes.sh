#!/bin/bash
# Build release notes for TAG from the commit subjects since the previous tag.
#
# Buckets by conventional-commit prefix, which is the convention this repo
# already follows, so no PR labelling is needed. Dependabot's "Bump x from a to
# b" commits are counted rather than listed — 24 of them in beta.10 would have
# buried the five changes that mattered.
#
# Usage: .scripts/release-notes.sh <tag> [previous-tag]
set -e

TAG="$1"
PREV="${2:-$(git describe --tags --abbrev=0 "${TAG}^" 2>/dev/null || true)}"
REPO="${GITHUB_REPOSITORY:-roderickhsiao/react-in-viewport}"

if [ -z "$TAG" ]; then
  echo "usage: $0 <tag> [previous-tag]" >&2
  exit 1
fi

RANGE="$TAG"
[ -n "$PREV" ] && RANGE="$PREV..$TAG"

SUBJECTS=$(git log --no-merges --format='%s' "$RANGE")

# $1 = heading, $2... = prefixes to match
section() {
  local heading="$1"; shift
  local pattern
  pattern=$(printf '%s|' "$@"); pattern="^(${pattern%|})(\([^)]*\))?!?: "
  local body
  body=$(printf '%s\n' "$SUBJECTS" | grep -E "$pattern" | sed -E "s/$pattern//" | sed 's/^/- /' || true)
  # `if`, not `&&`: under `set -e` a false `[ ]` as the last command aborts the
  # whole script, silently truncating the notes at the first empty section.
  if [ -n "$body" ]; then
    printf '## %s\n\n%s\n\n' "$heading" "$body"
  fi
}

section 'Added' feat
section 'Fixed' fix perf
section 'Changed' refactor chore style build ci
section 'Documentation' docs

DEPS=$(printf '%s\n' "$SUBJECTS" | grep -cE '^Bump ' || true)
if [ "$DEPS" -gt 0 ]; then
  printf '## Dependencies\n\n- %s dependency updates\n\n' "$DEPS"
fi

# Anything that did not match a known prefix still has to appear — silence here
# would mean a real change is dropped from the notes without anyone noticing.
OTHER=$(printf '%s\n' "$SUBJECTS" \
  | grep -vE '^(feat|fix|perf|refactor|chore|style|build|ci|docs)(\([^)]*\))?!?: ' \
  | grep -vE '^Bump ' \
  | grep -vE "^${TAG#v}$" \
  | sed 's/^/- /' || true)
if [ -n "$OTHER" ]; then
  printf '## Other\n\n%s\n\n' "$OTHER"
fi

if [ -n "$PREV" ]; then
  printf '**Full changelog**: https://github.com/%s/compare/%s...%s\n' "$REPO" "$PREV" "$TAG"
fi

exit 0
