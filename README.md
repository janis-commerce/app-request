# @janiscommerce/app-request
![janis-logo](brand-logo.png)

This package is intended to help to do requests at Janis Apps.


## Installation

```bash
npm i @janiscommerce/app-request
```


## Usage

```javascript
import Request from '@janiscommerce/app-request'
import {JANIS_ENV} from 'env.json'


const request = new Request({JANIS_ENV})

// GET to a janis service
const sessionData = await request.get({service: 'picking', namespace: 'session', id: '123'});


// GET (list) to a janis service
const sessionList = await request.list({
				namespace: 'session',
				service: 'picking',
				headers: {page: 3},
				queryParams: {
					filters: {sessionOwnershipVisibility, pickingPointId: activeWarehouseId},
					sort: sessionSortingCriteria,
				},
			})


// GET to an external endpoint

const data = await request.get({endpoint: 'https://url.external/userdata/123'})
```