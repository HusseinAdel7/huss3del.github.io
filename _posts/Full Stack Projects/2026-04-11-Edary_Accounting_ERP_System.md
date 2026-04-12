---
title: Edary — Accounting & ERP System
description: Enterprise ERP on .NET 10, ABP 10, EF Core 10, SQL Server, OpenIddict, Angular 20 + ABP NG, Serilog, multi-tenancy, and integrated licensing (ELG).
classes: wide
ribbon: MidnightBlue
categories:
  - Full_Stack_Projects
toc: true
permalink: /full_stack_projects/Edary_Accounting_ERP_System/
header:
  teaser: /assets/projects/edary/mp.png
---

Enterprise **accounting and ERP** for financial management, **chart of accounts**, transactions, and reporting. The codebase follows **layered DDD** with **ABP**, a **SPA** on **Angular 20**, and a **self-contained** Windows host for release deployments.

## At a glance

| Layer | Technology |
|-------|------------|
| Backend | .NET 10, ASP.NET Core, ABP 10 |
| API | Auto API controllers / HttpApi, Swagger (Swashbuckle via ABP) |
| Database | EF Core 10 + SQL Server |
| Auth | OpenIddict + ABP Identity |
| Frontend | Angular 20 + ABP NG 10 |
| DI | Autofac |
| Logging | Serilog |
| Tests | xUnit, NSubstitute, Shouldly, Volo.Abp.TestBase |

## Demo video

{% assign edary_video = '/assets/projects/edary/edary-demo.mp4' | relative_url %}
<video class="pro-embed-video" controls playsinline preload="auto" src="{{ edary_video }}" style="width:100%;border-radius:8px;margin:0.75rem 0 0.35rem;background:#111;">
  <source src="{{ edary_video }}" type="video/mp4" />
</video>

<p class="pro-video-fallback" style="margin:0 0 1rem;font-size:0.9rem;opacity:0.85;"><a href="{{ edary_video }}" download="edary-demo.mp4" target="_blank" rel="noopener noreferrer">Open / download demo (MP4)</a></p>

## Platform & backend host

- **.NET 10** (`net10.0`), **C#** with **`LangVersion: latest`**, **nullable reference types** enabled.
- **ASP.NET Core** web host (**`Edary.HttpApi.Host`**) with **in-process** hosting.
- **Release** publishing: **self-contained** deployment for **Windows x64** so **`Edary.HttpApi.Host.exe`** can run **without a separate .NET runtime** on the machine (per project settings).

## ABP Framework (layered DDD)

**ABP 10.0.2** (`Volo.Abp`) — layered application template:

- **Domain.Shared** — constants, enums, localization  
- **Domain** — entities, repository contracts, domain services  
- **Application.Contracts** — DTOs, application service interfaces  
- **Application** — use-case implementations  
- **EntityFrameworkCore** — data access  
- **HttpApi** + **HttpApi.Host** — API surface and hosting  
- **DbMigrator** — database migrations and seed data  

**Dependency injection:** **Autofac** (`Volo.Abp.Autofac`).  
**API docs:** **Swashbuckle** through **Volo.Abp.Swashbuckle**.  
**Multi-tenancy:** **Volo.Abp.AspNetCore.MultiTenancy**.  
**Tooling:** **ABP Studio Client** where it fits the workflow.

## Authentication & identity

- **OpenIddict** via ABP packages (**OpenIddict** + **Account.Web.OpenIddict**), with **`openiddict.pfx`** on the host.
- **Identity** and **tenant management** integrated in ABP (domain, application, EF Core layers).
- **IdentityModel** for OAuth/OpenID Connect on clients or integrations.

## Database & data access

- **Entity Framework Core 10** with **SQL Server** (`Volo.Abp.EntityFrameworkCore.SqlServer`).
- Built-in **EF modules**: permissions, settings, background jobs, auditing, features, **BLOB storage in the database**, OpenIddict, Identity, tenant management.
- Host also uses **EF Core InMemory** for auxiliary scenarios (e.g. health checks or in-app test paths).
- **Microsoft.EntityFrameworkCore.Tools** for **`dotnet ef`** migrations.

## Frontend (SPA)

- **Angular 20**, **TypeScript ~5.8**, **RxJS 7.8**, **Zone.js**.
- **ABP Angular 10.0.2:** `@abp/ng.core`, `@abp/ng.oauth`, `@abp/ng.identity`, `@abp/ng.account`, `@abp/ng.tenant-management`, feature/settings management, **Basic** theme.
- **Angular CLI 20**; production build via **`ng build --configuration production`**.
- **Publish integration:** on publish, Angular is built (`npm ci` / `npm install` then **`build:prod`**) and output is copied into the host **`wwwroot`**.

## Logging, monitoring & health

- **Serilog** with ASP.NET Core integration and **Serilog.Sinks.Async**.
- **Health Checks UI** (UI + in-memory storage) with health-check clients.

## Application & domain extras

- **Emailing** (`Volo.Abp.Emailing`), **caching** (`Volo.Abp.Caching`).
- **AutoMapper** via **Volo.Abp.AutoMapper** in the application layer (note: an **rc** package version may appear in one project vs **10.0.2** elsewhere).
- **System.Management** in the app (typically **Windows machine / WMI-style** reads).

## Side projects & tooling

- **Edary.LicenseGenerator** — **.NET 10** console app using **System.Management** (WMI-oriented) for license / machine binding (pairs with the **ELG** desktop issuer on the portfolio).
- **Edary.HttpApi.Client** plus a **console test** client project.
- **KubernetesClient** on the host — commonly used for **Kubernetes** integration or cluster-side configuration.

## Tests

- **xUnit** with **Microsoft.NET.Test.Sdk**, **Shouldly**, **NSubstitute**, **Volo.Abp.TestBase**.

## Related — licensing (ELG)

**Edary License Generator (ELG)** issues **RSA-signed JSON licenses** (customer, machine ID, expiry) for Edary deployments. Details: [Edary License Generator (ELG)]({{ '/desktop_applications/Edary_License_Generator_ELG/' | relative_url }}).
