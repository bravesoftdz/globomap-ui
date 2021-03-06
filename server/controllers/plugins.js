/*
Copyright 2018 Globo.com

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const express = require('express');
const GmapClient = require('globomap-api-jsclient');
const config = require('../config');

const router = express.Router();
const zabbixEquipmentTypes = process.env.ZABBIX_EQUIP_TYPES || 'Servidor,Servidor Virtual';

const gmapclient = new GmapClient({
  username: config.globomapApiUsername,
  password: config.globomapApiPassword,
  apiUrl: config.globomapApiUrl
});

// Zabbix
router.get('/', (req, res) => {
  gmapclient.getPlugins()
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        error: true,
        message: 'Get Plugins Error'
      });
    });

});

router.get('/healthcheck', (req, res) => {
  const { equipment_type, ips } = req.query;
  const eTypes = zabbixEquipmentTypes.split(',');
  const nodeType = equipment_type || '';

  if(!eTypes.includes(nodeType)) {
    return res.status(200).json([]);
  }

  gmapclient.pluginData('healthcheck', {
      ips: Array.from(ips || '')
    })
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        error: true,
        message: 'Get Healthcheck Error'
      });
    });

});

router.get('/zabbix/monitoring', (req, res) => {
  const { equipment_type, ips } = req.query;
  const eTypes = zabbixEquipmentTypes.split(',');
  const nodeType = equipment_type || '';

  if(!eTypes.includes(nodeType)) {
    return res.status(200).json([]);
  }

  gmapclient.pluginData('zabbix', {
      ips: Array.from(ips || '')
    })
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        error: true,
        message: 'Get Monitoring Error'
      });
    });

});

router.get('/zabbix/graph', (req, res) => {
  const { graphId } = req.query;

  gmapclient.pluginData('zabbix', {
    encoded: 1,
    graphid: graphId
  })
  .then((data) => {
    return res.status(200).json(data);
  })
  .catch((error) => {
    // retry
    gmapclient.pluginData('zabbix', {
      encoded: 1,
      graphid: graphId
    })
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        error: true,
        message: 'Get Zabbix Graph Error'
      });
    });
  });

});

module.exports = router;
