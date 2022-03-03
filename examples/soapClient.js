/**
 * a soap client
 */
/* eslint-disable no-console */

const { soapRequest, soapEnvelope } = require('./soapRequest.js')

const log = (arg) => console.log(JSON.stringify(arg, null, 2))

const URL = 'https://www.crcind.com/csp/samples/SOAP.Demo.cls'
const XML_NS = { 'xmlns:tem': 'http://tempuri.org' }

const envelope = soapEnvelope(URL, XML_NS)

const mission = () => envelope({
  action: 'http://tempuri.org/SOAP.Demo.Mission',
  header: {},
  body: {
    Mission: {
      _ns: 'tem'
    }
  },
  keys: 'MissionResponse.MissionResult'
})

const queryByName = (query) => envelope({
  action: 'http://tempuri.org/SOAP.Demo.QueryByName',
  body: {
    QueryByName: {
      _ns: 'tem',
      name: query
    }
  },
  keys: 'QueryByNameResponse.QueryByNameResult.diffgram.QueryByName_DataSet.QueryByName'
})

const main = async () => {
  log(await soapRequest(queryByName, 'Y'))
  log(await soapRequest(mission))
}

main().catch(console.error)
