# Setup bunko

Install Bun and a checksum- and provenance-verified [bunko](https://github.com/sakajunquality/bunko) CLI on Linux and macOS GitHub Actions runners.

```yaml
permissions:
  contents: read

steps:
  - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7
  - uses: sakajunquality/setup-bunko@v0.1.1
    with:
      version: v0.8.0
  - run: bunko version
```

For immutable workflow dependencies, replace `v0.1.1` with its full commit SHA from the release page. Full version tags are protected against updates and deletion. There are no floating major-version tags.

## Requirements

GitHub-hosted Ubuntu and macOS runners are tested with Bun 1.3.13 and 1.4.2. Windows is unsupported. Self-hosted runners need Bash, the prerequisites of [setup-bun](https://github.com/oven-sh/setup-bun), and a recent GitHub CLI (`gh`) supporting `gh attestation verify`. Network access to GitHub.com release assets, attestations, and Bun downloads is required. Release repositories hosted on GitHub Enterprise Server are not supported.

The default CLI supports Bun >=1.3.13 and <1.5. Older explicitly selected CLI versions have their own runtime requirements. Docker is not needed to install bunko; individual build features may have additional requirements.

## Inputs

| Input | Default | Purpose |
| --- | --- | --- |
| `version` | `v0.8.0` | Full CLI release version, independent of this Action's version. |
| `bun-version` | `1.4.2` | Bun version installed by setup-bun. |
| `repository` | `sakajunquality/bunko` | Trusted GitHub.com repository hosting compatible release assets. |
| `token` | `${{ github.token }}` | Token with read access to release assets and attestations. |
| `verify-attestation` | `true` | Verify release provenance and version-tag identity before execution; requires `gh`. |
| `source-commit` | Empty | Optional full source commit digest to constrain provenance verification. Requires `verify-attestation: 'true'`. |
| `distribution-directory` | Empty | Local directory with `bunko.js`, `LICENSE`, `THIRD_PARTY_NOTICES.md`, and `SHA256SUMS`; also requires `PROVENANCE.jsonl` when attestation verification is enabled. |

Normal public-release installation uses `contents: read`. A custom private release repository may require a separate token scoped to that repository. Never put credentials directly in workflow files.

## Outputs

| Output | Meaning |
| --- | --- |
| `version` | Installed CLI version without the `v` prefix. |
| `bunko-path` | Absolute path to the executable wrapper. |

The Action adds `bunko` to `PATH` for subsequent steps. It installs into a temporary directory and does not configure a persistent CLI cache. A local distribution avoids release payload downloads; provenance verification may still need network access.

## Build an image

After setup, use the CLI or the [companion build Action](https://github.com/sakajunquality/bunko/tree/main/build):

```yaml
- uses: sakajunquality/setup-bunko@v0.1.1
- uses: sakajunquality/bunko/build@9ec19b72a2ef8b65d3933154484a7de5b301a620 # v0.8.0
  with:
    path: .
    push: 'false'
```

Registry authentication and publishing are separate steps. See the [bunko documentation](https://github.com/sakajunquality/bunko#readme) for image builds, caching, and registry configuration.

## Maintenance and releases

This composite Action forwards all inputs and outputs to the existing bunko installer, pinned to `9ec19b72a2ef8b65d3933154484a7de5b301a620` (v0.8.0). It contains no duplicate installer implementation. Its release number is independent of the CLI: Action v0.1.1 installs CLI v0.8.0 by default, and overriding `version` does not inherit a fixed source digest.

Updates must check input/output parity against the pinned upstream metadata and pass Linux/macOS consumer tests, including version overrides, PATH/outputs, local distributions, checksum rejection, and incorrect source identity rejection. Review the implementation pin, CLI default, README, and tests together. Publish a new full Action version after CI succeeds; do not move an existing release tag. This repository does not publish CLI, npm, or container artifacts.

Bug reports and feature requests are welcome in [Issues](https://github.com/sakajunquality/setup-bunko/issues). See [SECURITY.md](SECURITY.md) for private vulnerability reporting. Licensed under [MIT](LICENSE).
