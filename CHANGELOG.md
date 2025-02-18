# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

[Unreleased]

### 2.6.0 - 2025-02-13

### Changed

- Version oauth-native to 1.5.0

### 2.5.0 - 2025-02-13

### Changed

- Return error from getUserInfo and getAccessToken

### 2.4.4 - 2025-01-02

### Fixed

- An error with an object validation - [APPSRN-355](https://janiscommerce.atlassian.net/browse/APPSRN-355)

### 2.4.3 - 2024-12-11

### Fixed

- params code_status and response_time from measurement_request

### 2.4.2 - 2024-11-04

### Fixed

- Fixed parseQueryParams to support sorts with array format.

### 2.4.1 - 2024-10-03

### Fixed

- Fixed parse query params to support objects.

### 2.4.0 - 2024-09-30

### Changed

- Name params to params_endpoint in axios instance

### 2.3.2 - 2024-09-24

### Fixed

- Validation in substring param

### 2.3.1 - 2024-09-23

### Fixed

- Validation error for environment in axios instance

### 2.3.0 - 2024-09-23

### Added

- interceptor to log info in analytics
- add substring method to avoid error length limit in analytics

### 2.2.0 - 2024-04-23

### Fixed

- Fixed error handling at makeRequest.

### 2.1.0 - 2024-04-10

### Added

- Added more data in the errors registered in crashlytics - [APPSRN-294](https://janiscommerce.atlassian.net/browse/APPSRN-294)

### 2.0.0 - 2024-04-03

### Breaking Changes

### Changed

- Changed response of get method, now every method returns the same structure - [APPSRN-283](https://janiscommerce.atlassian.net/browse/APPSRN-283)

### Fixed

- Fixed use of sort params

### 1.2.1 - 2024-03-14

### Fixed

- Fixed an error with headers when using get method with a custom endpoint

### 1.2.0 - 2024-03-06

### Added

- Added POST, PUT and PATCH methods with their own crashlytics log

### 1.1.2 - 2024-03-04

### Fixed

- Fixed error message logged at crashlytics and returned at GET / LIST catch.

### 1.1.1 - 2024-02-08

### Fixed

- Fixed refreshHeaders function to format correctly headers like page, pageSize, getTotals and getOnlyTotals.

### 1.1.0 - 2024-02-01

### Changed

- When making a get request, id is no longer required

### 1.0.0 - 2024-01-24

### Added

- Added request class with get and list methods

### Fixed

- Fixed eslint, prettier and husky configs
