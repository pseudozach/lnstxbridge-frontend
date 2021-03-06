# [1.2.0-beta](https://github.com/BoltzExchange/boltz-frontend/compare/v1.1.0-beta...v1.2.0-beta) (2020-01-14)


### Bug Fixes

* block explorer link on invoice page ([#220](https://github.com/BoltzExchange/boltz-frontend/issues/220)) ([005d107](https://github.com/BoltzExchange/boltz-frontend/commit/005d107))
* bug that caused success page after confirmation of 0-conf ([#219](https://github.com/BoltzExchange/boltz-frontend/issues/219)) ([2c0f6b1](https://github.com/BoltzExchange/boltz-frontend/commit/2c0f6b1))
* claim transaction when doing two reverse swaps ([#209](https://github.com/BoltzExchange/boltz-frontend/issues/209)) ([016757a](https://github.com/BoltzExchange/boltz-frontend/commit/016757a))
* hardcoded onion URL ([#218](https://github.com/BoltzExchange/boltz-frontend/issues/218)) ([60ae870](https://github.com/BoltzExchange/boltz-frontend/commit/60ae870))
* parsing of transaction events ([293906e](https://github.com/BoltzExchange/boltz-frontend/commit/293906e))
* QR code of normal swaps ([82355c7](https://github.com/BoltzExchange/boltz-frontend/commit/82355c7))
* show fee as percentage and not relative amount ([#214](https://github.com/BoltzExchange/boltz-frontend/issues/214)) ([aa6ec8f](https://github.com/BoltzExchange/boltz-frontend/commit/aa6ec8f))
* style of pay invoice page on mobile ([11d5bed](https://github.com/BoltzExchange/boltz-frontend/commit/11d5bed))
* trim prefix of scanned QR code data ([#222](https://github.com/BoltzExchange/boltz-frontend/issues/222)) ([358b319](https://github.com/BoltzExchange/boltz-frontend/commit/358b319))
* update invoice wording ([b256c16](https://github.com/BoltzExchange/boltz-frontend/commit/b256c16))
* use onion address for API requests ([1ce7538](https://github.com/BoltzExchange/boltz-frontend/commit/1ce7538))
* WebLN invoice pasting ([55b5613](https://github.com/BoltzExchange/boltz-frontend/commit/55b5613))


### Features

* add fee percentage ([#213](https://github.com/BoltzExchange/boltz-frontend/issues/213)) ([50326d0](https://github.com/BoltzExchange/boltz-frontend/commit/50326d0))
* add onion URL to header ([cc7e3ca](https://github.com/BoltzExchange/boltz-frontend/commit/cc7e3ca))
* add QR code scanner ([#221](https://github.com/BoltzExchange/boltz-frontend/issues/221)) ([e0ce5c3](https://github.com/BoltzExchange/boltz-frontend/commit/e0ce5c3))
* add-api-route ([#228](https://github.com/BoltzExchange/boltz-frontend/issues/228)) ([8918808](https://github.com/BoltzExchange/boltz-frontend/commit/8918808))
* iOS compatible refund flow ([#224](https://github.com/BoltzExchange/boltz-frontend/issues/224)) ([2a2f166](https://github.com/BoltzExchange/boltz-frontend/commit/2a2f166))
* show onion addresses of LNDs ([#216](https://github.com/BoltzExchange/boltz-frontend/issues/216)) ([b0bd9b2](https://github.com/BoltzExchange/boltz-frontend/commit/b0bd9b2))
* support new hold reverse swaps ([e6e5ce6](https://github.com/BoltzExchange/boltz-frontend/commit/e6e5ce6))
* switch from refund JSON to QR code ([927d019](https://github.com/BoltzExchange/boltz-frontend/commit/927d019))



# [1.1.0-beta](https://github.com/BoltzExchange/boltz-frontend/compare/v1.0.0-beta.2...v1.1.0-beta) (2019-08-27)


### Bug Fixes

* calculation of limits of LTC/BTC pair ([#201](https://github.com/BoltzExchange/boltz-frontend/issues/201)) ([dbe8545](https://github.com/BoltzExchange/boltz-frontend/commit/dbe8545))
* fee calculation ([#192](https://github.com/BoltzExchange/boltz-frontend/issues/192)) ([a38a159](https://github.com/BoltzExchange/boltz-frontend/commit/a38a159))
* remove whitespace when copying addresses and invoices ([#207](https://github.com/BoltzExchange/boltz-frontend/issues/207)) ([ea8280e](https://github.com/BoltzExchange/boltz-frontend/commit/ea8280e))
* typo in "Voil??" screen ([5072fb3](https://github.com/BoltzExchange/boltz-frontend/commit/5072fb3))
* undefined limits for BTC/BTC and LTC/LTC pair ([#202](https://github.com/BoltzExchange/boltz-frontend/issues/202)) ([5de799c](https://github.com/BoltzExchange/boltz-frontend/commit/5de799c))
* wrong API parameter when refunding swaps ([#206](https://github.com/BoltzExchange/boltz-frontend/issues/206)) ([5eb248b](https://github.com/BoltzExchange/boltz-frontend/commit/5eb248b))


### Features

* handle aborted swaps ([#191](https://github.com/BoltzExchange/boltz-frontend/issues/191)) ([2c7843a](https://github.com/BoltzExchange/boltz-frontend/commit/2c7843a))
* handle zero conf swaps ([#195](https://github.com/BoltzExchange/boltz-frontend/issues/195)) ([7555fb9](https://github.com/BoltzExchange/boltz-frontend/commit/7555fb9))
* handle zero conf swaps from backend ([#198](https://github.com/BoltzExchange/boltz-frontend/issues/198)) ([c097865](https://github.com/BoltzExchange/boltz-frontend/commit/c097865))



# [1.0.0-beta.2](https://github.com/BoltzExchange/boltz-frontend/compare/v1.0.0-beta...v1.0.0-beta.2) (2019-05-16)


### Bug Fixes

* input on landing page ([#177](https://github.com/BoltzExchange/boltz-frontend/issues/177)) ([948a1e4](https://github.com/BoltzExchange/boltz-frontend/commit/948a1e4))
* reverse lockup timeout component ([5ec379d](https://github.com/BoltzExchange/boltz-frontend/commit/5ec379d))
* set encoding of preimages to hex ([70c70ec](https://github.com/BoltzExchange/boltz-frontend/commit/70c70ec))
* webln undefined in landing page ([#186](https://github.com/BoltzExchange/boltz-frontend/issues/186)) ([726ccfe](https://github.com/BoltzExchange/boltz-frontend/commit/726ccfe))


### Features

* wait for response before sending another request ([#185](https://github.com/BoltzExchange/boltz-frontend/issues/185)) ([c95f361](https://github.com/BoltzExchange/boltz-frontend/commit/c95f361))



# 1.0.0-beta (2019-04-27)


### Bug Fixes

* alignment issues ([#104](https://github.com/BoltzExchange/boltz-frontend/issues/104)) ([87a40af](https://github.com/BoltzExchange/boltz-frontend/commit/87a40af))
* also switch amounts when switching assets ([a8851e9](https://github.com/BoltzExchange/boltz-frontend/commit/a8851e9))
* argument order of constructRefundTransaction ([dbcbd62](https://github.com/BoltzExchange/boltz-frontend/commit/dbcbd62))
* block explorer link in non final dialog ([#168](https://github.com/BoltzExchange/boltz-frontend/issues/168)) ([e3ec1e9](https://github.com/BoltzExchange/boltz-frontend/commit/e3ec1e9))
* cache only valid input amount ([#162](https://github.com/BoltzExchange/boltz-frontend/issues/162)) ([5dd03fb](https://github.com/BoltzExchange/boltz-frontend/commit/5dd03fb))
* calculation of base amount ([#134](https://github.com/BoltzExchange/boltz-frontend/issues/134)) ([6bfe8bb](https://github.com/BoltzExchange/boltz-frontend/commit/6bfe8bb))
* cleaning of swap reducers ([#90](https://github.com/BoltzExchange/boltz-frontend/issues/90)) ([168472d](https://github.com/BoltzExchange/boltz-frontend/commit/168472d)), closes [#95](https://github.com/BoltzExchange/boltz-frontend/issues/95)
* enable Bitcoin onchain swaps again ([#167](https://github.com/BoltzExchange/boltz-frontend/issues/167)) ([31e9f47](https://github.com/BoltzExchange/boltz-frontend/commit/31e9f47))
* FAQ LND node style ([#94](https://github.com/BoltzExchange/boltz-frontend/issues/94)) ([93aa538](https://github.com/BoltzExchange/boltz-frontend/commit/93aa538))
* fee calculation of quote amount ([#146](https://github.com/BoltzExchange/boltz-frontend/issues/146)) ([3f39758](https://github.com/BoltzExchange/boltz-frontend/commit/3f39758))
* fee for sell orders ([#149](https://github.com/BoltzExchange/boltz-frontend/issues/149)) ([652c529](https://github.com/BoltzExchange/boltz-frontend/commit/652c529))
* input on landing page ([1fa26e9](https://github.com/BoltzExchange/boltz-frontend/commit/1fa26e9))
* Joule make invoice amounts ([da9cb19](https://github.com/BoltzExchange/boltz-frontend/commit/da9cb19))
* minor linting error ([d5eb9db](https://github.com/BoltzExchange/boltz-frontend/commit/d5eb9db))
* navigation tabs ([06ab368](https://github.com/BoltzExchange/boltz-frontend/commit/06ab368))
* remove trailing zeros ([#98](https://github.com/BoltzExchange/boltz-frontend/issues/98)) ([6cfadd6](https://github.com/BoltzExchange/boltz-frontend/commit/6cfadd6))
* rounding error ([7503867](https://github.com/BoltzExchange/boltz-frontend/commit/7503867))
* show correct link to block explorer on lockup page ([3726a31](https://github.com/BoltzExchange/boltz-frontend/commit/3726a31))
* show errors for broadcasttransaction requests ([f1bdb5a](https://github.com/BoltzExchange/boltz-frontend/commit/f1bdb5a))
* show errors of failed requests ([#84](https://github.com/BoltzExchange/boltz-frontend/issues/84)) ([4a46bd3](https://github.com/BoltzExchange/boltz-frontend/commit/4a46bd3))
* show webln warning just in console ([#145](https://github.com/BoltzExchange/boltz-frontend/issues/145)) ([e3f15e1](https://github.com/BoltzExchange/boltz-frontend/commit/e3f15e1))
* trim "lightning:" prefix of invoices ([#171](https://github.com/BoltzExchange/boltz-frontend/issues/171)) ([da3e420](https://github.com/BoltzExchange/boltz-frontend/commit/da3e420))
* update invoice message ([d5a04b3](https://github.com/BoltzExchange/boltz-frontend/commit/d5a04b3))
* valid default amount ([f6e342c](https://github.com/BoltzExchange/boltz-frontend/commit/f6e342c))
* validate assets after mounting component ([#102](https://github.com/BoltzExchange/boltz-frontend/issues/102)) ([471f122](https://github.com/BoltzExchange/boltz-frontend/commit/471f122))
* wait for invoice paid event ([ecfc45e](https://github.com/BoltzExchange/boltz-frontend/commit/ecfc45e))
* wording of last FAQ paragraph ([#97](https://github.com/BoltzExchange/boltz-frontend/issues/97)) ([79e52cd](https://github.com/BoltzExchange/boltz-frontend/commit/79e52cd))


### Features

* accurate examples for addresses and invoices ([52cbfa9](https://github.com/BoltzExchange/boltz-frontend/commit/52cbfa9))
* add assets switcher ([#86](https://github.com/BoltzExchange/boltz-frontend/issues/86)) ([a6c9597](https://github.com/BoltzExchange/boltz-frontend/commit/a6c9597))
* add better alerts for main event ([#135](https://github.com/BoltzExchange/boltz-frontend/issues/135)) ([b4b6de4](https://github.com/BoltzExchange/boltz-frontend/commit/b4b6de4))
* add details about swap to success page ([#114](https://github.com/BoltzExchange/boltz-frontend/issues/114)) ([efdaad9](https://github.com/BoltzExchange/boltz-frontend/commit/efdaad9))
* add FAQ page ([#105](https://github.com/BoltzExchange/boltz-frontend/issues/105)) ([0144049](https://github.com/BoltzExchange/boltz-frontend/commit/0144049))
* add FAQ section ([e8a85c6](https://github.com/BoltzExchange/boltz-frontend/commit/e8a85c6))
* add file upload button and zone ([#5](https://github.com/BoltzExchange/boltz-frontend/issues/5)) ([6e5ffd1](https://github.com/BoltzExchange/boltz-frontend/commit/6e5ffd1))
* add footer ([#73](https://github.com/BoltzExchange/boltz-frontend/issues/73)) ([7314cea](https://github.com/BoltzExchange/boltz-frontend/commit/7314cea))
* add link component ([#117](https://github.com/BoltzExchange/boltz-frontend/issues/117)) ([efcaa53](https://github.com/BoltzExchange/boltz-frontend/commit/efcaa53))
* add loading state to swaptab ([#39](https://github.com/BoltzExchange/boltz-frontend/issues/39)) ([54b499d](https://github.com/BoltzExchange/boltz-frontend/commit/54b499d))
* add modal ([#64](https://github.com/BoltzExchange/boltz-frontend/issues/64)) ([27b1542](https://github.com/BoltzExchange/boltz-frontend/commit/27b1542))
* add reconnecting logic to normal swaps ([#128](https://github.com/BoltzExchange/boltz-frontend/issues/128)) ([8da500e](https://github.com/BoltzExchange/boltz-frontend/commit/8da500e))
* add redux devtools ([#163](https://github.com/BoltzExchange/boltz-frontend/issues/163)) ([2aaee10](https://github.com/BoltzExchange/boltz-frontend/commit/2aaee10))
* add refunds ([#10](https://github.com/BoltzExchange/boltz-frontend/issues/10)) ([da242cc](https://github.com/BoltzExchange/boltz-frontend/commit/da242cc))
* add reverse swap ([#49](https://github.com/BoltzExchange/boltz-frontend/issues/49)) ([d7b2449](https://github.com/BoltzExchange/boltz-frontend/commit/d7b2449))
* block explorer link in environment file ([673a542](https://github.com/BoltzExchange/boltz-frontend/commit/673a542))
* calculate trading fee ([#112](https://github.com/BoltzExchange/boltz-frontend/issues/112)) ([bb08715](https://github.com/BoltzExchange/boltz-frontend/commit/bb08715))
* disable inputs when rate is undefined ([#156](https://github.com/BoltzExchange/boltz-frontend/issues/156)) ([e81cf66](https://github.com/BoltzExchange/boltz-frontend/commit/e81cf66))
* dont include middelware in production build ([#89](https://github.com/BoltzExchange/boltz-frontend/issues/89)) ([5fede40](https://github.com/BoltzExchange/boltz-frontend/commit/5fede40))
* get currencies and rates from middleware ([3020afc](https://github.com/BoltzExchange/boltz-frontend/commit/3020afc))
* get fee estimation from middleware ([#103](https://github.com/BoltzExchange/boltz-frontend/issues/103)) ([63e7240](https://github.com/BoltzExchange/boltz-frontend/commit/63e7240))
* get limits from middleware api ([ca28e9b](https://github.com/BoltzExchange/boltz-frontend/commit/ca28e9b))
* include claim fee in estimation ([81f2c30](https://github.com/BoltzExchange/boltz-frontend/commit/81f2c30))
* indicate refund file upload ([#36](https://github.com/BoltzExchange/boltz-frontend/issues/36)) ([964455e](https://github.com/BoltzExchange/boltz-frontend/commit/964455e))
* integrate circleci ([#88](https://github.com/BoltzExchange/boltz-frontend/issues/88)) ([65241b4](https://github.com/BoltzExchange/boltz-frontend/commit/65241b4))
* Lightning Joule integration ([b4adfed](https://github.com/BoltzExchange/boltz-frontend/commit/b4adfed))
* listen to events from middleware ([c8affe9](https://github.com/BoltzExchange/boltz-frontend/commit/c8affe9))
* make "You receive" input editable ([#45](https://github.com/BoltzExchange/boltz-frontend/issues/45)) ([1192e1b](https://github.com/BoltzExchange/boltz-frontend/commit/1192e1b))
* make Boltz logo clickable ([2b98bf7](https://github.com/BoltzExchange/boltz-frontend/commit/2b98bf7))
* more versatile errors on homepage ([#76](https://github.com/BoltzExchange/boltz-frontend/issues/76)) ([701878b](https://github.com/BoltzExchange/boltz-frontend/commit/701878b))
* move LND node URIs to environment file ([#93](https://github.com/BoltzExchange/boltz-frontend/issues/93)) ([7d096d9](https://github.com/BoltzExchange/boltz-frontend/commit/7d096d9))
* new success page for swaps ([#65](https://github.com/BoltzExchange/boltz-frontend/issues/65)) ([72b4885](https://github.com/BoltzExchange/boltz-frontend/commit/72b4885))
* prompt component ([#16](https://github.com/BoltzExchange/boltz-frontend/issues/16)) ([5e88fd0](https://github.com/BoltzExchange/boltz-frontend/commit/5e88fd0))
* reconnect to event stream ([#119](https://github.com/BoltzExchange/boltz-frontend/issues/119)) ([01d47d8](https://github.com/BoltzExchange/boltz-frontend/commit/01d47d8))
* setup mobile style ([#160](https://github.com/BoltzExchange/boltz-frontend/issues/160)) ([7280913](https://github.com/BoltzExchange/boltz-frontend/commit/7280913))
* show block explorer link for non final transactions ([#166](https://github.com/BoltzExchange/boltz-frontend/issues/166)) ([bbc3181](https://github.com/BoltzExchange/boltz-frontend/commit/bbc3181))
* show correct network next to logo ([#108](https://github.com/BoltzExchange/boltz-frontend/issues/108)) ([7c522b4](https://github.com/BoltzExchange/boltz-frontend/commit/7c522b4))
* show error if invoice could not be paid ([#126](https://github.com/BoltzExchange/boltz-frontend/issues/126)) ([7b38103](https://github.com/BoltzExchange/boltz-frontend/commit/7b38103))
* show error if reverse swaps are disabled ([#153](https://github.com/BoltzExchange/boltz-frontend/issues/153)) ([7f22fe5](https://github.com/BoltzExchange/boltz-frontend/commit/7f22fe5))
* show error when requests on landing page fail ([df7b433](https://github.com/BoltzExchange/boltz-frontend/commit/df7b433))
* show swap id to the user ([#66](https://github.com/BoltzExchange/boltz-frontend/issues/66)) ([fe59162](https://github.com/BoltzExchange/boltz-frontend/commit/fe59162))
* show user that time lock of swap expired ([a19b885](https://github.com/BoltzExchange/boltz-frontend/commit/a19b885))
* store assets and base amount in local storage ([#87](https://github.com/BoltzExchange/boltz-frontend/issues/87)) ([b2fa64c](https://github.com/BoltzExchange/boltz-frontend/commit/b2fa64c))
* update footer tag ([#99](https://github.com/BoltzExchange/boltz-frontend/issues/99)) ([4b29986](https://github.com/BoltzExchange/boltz-frontend/commit/4b29986))
* use environment variables for API and networks ([c65888d](https://github.com/BoltzExchange/boltz-frontend/commit/c65888d))
* verify address provided by user is valid ([#121](https://github.com/BoltzExchange/boltz-frontend/issues/121)) ([d643d80](https://github.com/BoltzExchange/boltz-frontend/commit/d643d80))
* warning for mobile users ([#147](https://github.com/BoltzExchange/boltz-frontend/issues/147)) ([d204f41](https://github.com/BoltzExchange/boltz-frontend/commit/d204f41))
* write about fee structure on FAQ page ([6c2c9a0](https://github.com/BoltzExchange/boltz-frontend/commit/6c2c9a0))



