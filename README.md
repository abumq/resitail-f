# resitail-f

[![Version](https://img.shields.io/npm/v/resitail-f.svg)](https://www.npmjs.com/package/resitail-f)
[![GitHub license](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/abumq/resitail-f/blob/master/LICENSE)

resitail-f is [resitail hook](https://github.com/abumq/resitail#overview) that is much like `tail -f` for your browser specifically for residue

## Configuration

 | **Config** | Description |
 |-----------|--------------|
 | port | Port for HTTP server|
 | key (optional) | 256-bit AES key for secure clients |
 | auth (optional) | Object of "user" and "pwd_hash" (md5 hash of password) |
 | strict (optional) | If true a list of clients must be provided in parameters |
