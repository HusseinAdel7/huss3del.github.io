---
title: Edary License Generator (ELG)
description: Windows desktop tool to issue RSA-signed JSON licenses for Edary—customer, machine ID, and expiry bound with tamper-evident signature.
classes: wide
ribbon: MidnightBlue
categories:
  - Desktop_Applications
toc: false
permalink: /desktop_applications/Edary_License_Generator_ELG/
header:
  teaser: /assets/projects/edary-license-generator/images/logo.png
---

Internal Windows tool that issues **digitally signed JSON licenses** for **Edary**: you enter customer and machine data; the app outputs a license file verified on the client with the **public key** (the **private key** never ships).

Product context: **[Edary — Accounting & ERP]({{ '/full_stack_projects/Edary_Accounting_ERP_System/' | relative_url }})**.

{% assign elg_video = '/assets/projects/edary-license-generator/video/elg-demo.mp4' | relative_url %}
{% assign elg_poster = '/assets/projects/edary-license-generator/images/elg-screenshot-2.png' | relative_url %}
<video class="pro-embed-video" controls playsinline preload="auto" poster="{{ elg_poster }}" src="{{ elg_video }}" style="display:block;width:100%;max-width:420px;margin:0.75rem auto 0.35rem;border-radius:8px;background:#111;">
  <source src="{{ elg_video }}" type="video/mp4" />
</video>
<p class="pro-video-fallback" style="max-width:420px;margin:0 auto 1rem;font-size:0.9rem;opacity:0.85;text-align:center;"><a href="{{ elg_video }}" download="elg-demo.mp4" target="_blank" rel="noopener noreferrer">Open / download demo (MP4)</a></p>

## Architecture (sign-then-store)

Canonical UTF-8 payload, signed with **RSA-SHA256** and **PKCS#1 v1.5**:

`customerName|machineId|expireDate`

Fixed order, delimiter `|`, UTF-8. **signature** (Base64) is stored in JSON with the fields. Any field change without re-signing fails verification.

## Tech stack

| Item | Detail |
|------|--------|
| Framework | .NET 8, Windows Forms |
| Executable | `ELG.exe` |
| Distribution | Single-file, self-contained **win-x64** |
| Side | `CreateIcon` helper (not part of main build) |

## License file

- Fields: customer name, machine ID, expiry (`YYYY-MM-DD`).
- Private key: `%UserProfile%\private_key.pem` or next to the executable.
- Output: `licenses\{CustomerName}.license.key` beside the app; clients often use `C:\ProgramData\Edary\license.key`. Verification runs inside **Edary**.

## Issuer UI

- Arabic / English, RTL for Arabic; dark/light theme; settings in `%LocalAppData%\ELG\settings.txt`.
- Optional open `licenses` folder after save; default expiry +1 year.

## Keys

Keep **`private_key.pem`** only on the issuing machine. Customers get the license file only; **Edary** embeds the public key for verify-only use.
