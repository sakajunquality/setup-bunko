# Security policy

Report vulnerabilities privately through [bunko security advisories](https://github.com/sakajunquality/bunko/security/advisories/new). Do not include credentials or unpublished application source in public issues.

Use the latest setup-bunko release. Pin the Action to a full commit SHA for immutable workflow dependencies, and review updates before adopting them. The installer implementation and its dependencies are pinned to reviewed commits. CLI checksums and release provenance are verified before execution by default.

The `repository`, `distribution-directory`, and `token` inputs cross a trust boundary. Only use trusted release sources and files. Disabling `verify-attestation` retains checksum verification but removes signed source and tag identity verification. Do not execute untrusted pull-request inputs in a privileged workflow.
