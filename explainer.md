# Character Model for the World Wide Web: String Matching - Explainer

## Participate

- [Issue tracker](https://github.com/w3c/charmod-norm/issues)
- [Published Document](https://www.w3.org/TR/charmod-norm/)
- [Editor's Draft](https://w3c.github.io/charmod-norm/)

## Table of Contents

- [Introduction](#introduction)
- [How this relates to Unicode normalization](#how-this-relates-to-unicode-normalization)
- [User-Facing Problem](#user-facing-problem)
- [Proposed Approach](#proposed-approach)
- [Internationalization, Accessibility, Security, and Privacy Considerations](#internationalization-accessibility-security-and-privacy-considerations)

## Introduction

*Character Model for the World Wide Web: String Matching* ([charmod-norm](https://www.w3.org/TR/charmod-norm/)) is a document that answers one question for the people who write and implement specifications: **when are two strings the same?**

Every comparison, lookup, index, and search over strings on the web depends on an answer to "are these the same?" Text that a user considers identical can be encoded in several ways, and text a user considers different can look identical on screen.

The document gives specification developers a shared toolkit. It is a companion to *Character Model for the World Wide Web 1.0: Fundamentals* ([CHARMOD](https://www.w3.org/TR/charmod/)).

## How this relates to Unicode normalization

**Unicode normalization is one tool used inside the matching algorithm. It is not the subject of the document, and by itself it does not solve string matching.**

Unicode normalization ([UAX15](https://www.unicode.org/reports/tr15/)) does one job: it maps the several code point sequences that encode the same abstract character onto one of four normal forms, NFC, NFD, NFKC, and NFKD.

String matching asks a bigger question. It has to decide whether two *names* are the same name, for text that differs in case, that uses character escapes, that contains invisible characters, that composes emoji in different ways, that came from different legacy encodings, or that contains characters that merely look alike. Normalization covers part of that, so the document uses it as one step among several.

## User-Facing Problem

| What the user does | What happens | What actually happened |
| --- | --- | --- |
| Searches a page for `café` | No results, although the text is right there | The page's `café` is decomposed (`e` + U+0301); the keyboard produced a precomposed `é` |
| Is looked up by a name containing `ß` | "No such account" | One side folded `ß` to `ss` and the other did not; the two sides disagree |
| Types a Turkish name | The name is stored or displayed with the wrong letters | A language-independent uppercase mapping turned `ı` into `I` and `i` into `İ` |
| Sets a device or network name containing a ZWNJ | The name cannot be found later | An invisible character is part of the stored value; finding it means typing the same invisible character |
| Follows a link that looks like a known site | Lands on a different site | The link uses Cyrillic or Greek letters that look like Latin ones |
| Opens a legacy-encoded document | Characters do not match what a rule expects | A transcoder mapped a byte to a compatibility character |

### Goals

- Give specification authors one place to cite, instead of each specification inventing its own answer.
- Let users write in the characters and languages they actually use, rather than restricting identifiers to ASCII to avoid the problem.
- Separate content that users see from identifiers only machines use.
- Tell implementers where normalization, case folding, escaping, and transcoding belong in a matching operation.

### Non-goals

- **Making everything match.** This is not a fuzzy-matching or "find" specification.
- **Solving homograph attacks.** The document points to [UTR36](https://www.unicode.org/reports/tr36/) and [UTS39](https://www.unicode.org/reports/tr39/) and requires specifications to document the risk.
- **Replacing Unicode's definitions.** The document reuses Unicode case folding, the definition of ASCII case-insensitive matching from [Infra](https://infra.spec.whatwg.org/#ascii-case-insensitive), and the Unicode normalization forms.

### Audience and evidence

The primary audience is W3C specification developers, who can cite the document.

No formal user research was conducted for this Note. Its evidence base is more than twenty years of internationalization review.

## Proposed Approach

The document answers the question "are these two strings the same".

### The matching operation

A match runs the following steps, which the document calls the [matching algorithm](https://www.w3.org/TR/charmod-norm/#matchingAlgorithm):

1. **Convert both strings to sequences of Unicode code points.** Specifications MUST allow a Unicode character encoding, MUST specify a default encoding, and SHOULD specify UTF-8 as that default and disallow other encodings.
2. **Expand character escapes and includes**.
3. **Perform the chosen normalization step.** This is the one decision a specification makes, described in the next section.
4. **Perform any additional tailoring** the vocabulary needs. A specification MUST define that tailoring, and MUST name the source of the language information if the tailoring is language-sensitive.
5. **Compare the resulting sequences of code points for identity.**

### Choose a normalization step

There are exactly four choices for step 3: [default](https://www.w3.org/TR/charmod-norm/#DefaultNormalizationStep), [ASCII case fold](https://www.w3.org/TR/charmod-norm/#ASCIIFoldNormalizationStep), [Unicode canonical case fold](https://www.w3.org/TR/charmod-norm/#CanonicalFoldNormalizationStep), and [Unicode compatibility case fold](https://www.w3.org/TR/charmod-norm/#CompatibilityFoldNormalizationStep).

Only the default and the Unicode canonical case fold are meant for regular use. The ASCII step fits a vocabulary whose own keywords are ASCII. The compatibility step is presented for completeness.

What the choice means for some pairs of strings:

| String A | String B | Default | ASCII case fold | Unicode canonical case fold |
| --- | --- | --- | --- | --- |
| `hello` | `HELLO` | differ | match | match |
| `héllo` | `HÉLLO` | differ | differ | match |
| `hello` | `héllo` | differ | differ | differ |
| `Å` (U+00C5) | `A` + U+030A | differ | differ | match |
| `ﬃ` (U+FB03) | `ffi` | differ | differ | differ |
| Greek `Ρ` (U+03A1) | Latin `P` (U+0050) | differ | differ | differ |

### Do not impose normalization on content

The document's recommendations are the opposite of a normalization mandate:

- Specifications SHOULD NOT specify a Unicode normalization form for encoding, storage, or interchange of a vocabulary.
- Implementations MUST NOT alter the normalization form of syntactic or localizable content being exchanged, read, parsed, or processed, except as a side effect of transcoding, case folding, or another user-initiated change.
- Authoring tools SHOULD provide a way to normalize and SHOULD warn when content is not in NFC.
- Content authors SHOULD use NFC where possible and SHOULD use consistent character sequences.
- NFKC and NFKD SHOULD NOT be specified, and implementations MUST NOT apply them unless the end user asks.

### What matching cannot fix

Normalization and case folding do not address identical-looking characters. A specification needs to document, or provides a health warning about, any case where canonically equivalent but disjoint sequences create a security issue, and points to Unicode's security work for the rest.

### Example use cases

**A style sheet and a document.** The class name `héllo` can be written in CSS as `h\e9llo` and in HTML as `h&#xe9;llo`. Both sides expand to the same code points before matching.

**A non-ASCII format that wants case-insensitive keywords.** With the Unicode canonical case fold step, `green` matches `GREEN` and `héllo` matches `HÉLLO`, because folding runs over the full Unicode range rather than the ASCII range.

## Internationalization, Accessibility, Security, and Privacy Considerations

Internationalization is the subject of the document, and it shapes every recommendation. Allowing non-ASCII characters in user-facing identifiers, and requiring Unicode full case folding rather than the ASCII or simple variants, keep users from being penalized for the language they write in. Declining to require a normalization form protects authors whose input methods produce decomposed text, and protects content that relies on distinctions normalization would remove.

**Accessibility.** The same reasoning applies to users who interact with text differently: a rule that silently rejects or mismatches text costs those users.

**Security.** Identical-looking characters from different scripts are a spoofing vector. Invisible characters, including ZWJ, ZWNJ, variation selectors, and bidi controls, can hide inside an identifier. The document requires specifications to document or provide a health warning where canonically equivalent but disjoint sequences create a security issue, and defers to [UTR36](https://www.unicode.org/reports/tr36/) and [UTS39](https://www.unicode.org/reports/tr39/).

**Privacy.** User data is never silently rewritten as a side effect of a lookup.
