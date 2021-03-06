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

import { uuid, traverseItems } from '../../utils';
import { setCurrentNode } from './nodes';

const STAGE_ADD_NEW_NODE = 'stage_add_new_node';
const STAGE_REMOVE_NODE = 'stage_remove_node';
const STAGE_SET_NODES = 'stage_set_nodes';
const STAGE_CLEAN_NODES = 'stage_clean_nodes';

const SAVE_SHARED_MAP = 'save_shared_map';
const SAVE_SHARED_MAP_SUCCESS = 'save_shared_map_success';
const SAVE_SHARED_MAP_FAIL = 'save_shared_map_fail';

const GET_SHARED_MAP = 'get_shared_map';
const GET_SHARED_MAP_SUCCESS = 'get_shared_map_success';
const GET_SHARED_MAP_FAIL = 'get_shared_map_fail';

const SAVE_USER_MAP = 'save_user_map';
const SAVE_USER_MAP_SUCCESS = 'save_user_map_success';
const SAVE_USER_MAP_FAIL = 'save_user_map_fail';

const GET_USER_MAP = 'get_user_map';
const GET_USER_MAP_SUCCESS = 'get_user_map_success';
const GET_USER_MAP_FAIL = 'get_user_map_fail';

const DELETE_USER_MAP = 'delete_user_map';
const DELETE_USER_MAP_SUCCESS = 'delete_user_map_success';
const DELETE_USER_MAP_FAIL = 'delete_user_map_fail';

const LIST_USER_MAPS = 'list_user_maps';
const LIST_USER_MAPS_SUCCESS = 'list_user_maps_success';
const LIST_USER_MAPS_FAIL = 'list_user_maps_fail';

const initialState = {
  stageNodes: [],

  latestSharedMapKey: null,
  saveSharedLoading: false,
  getSharedLoading: false,

  userMaps: [],
  latestUserMapKey: null,
  saveUserMapLoading: false,
  getUserMapLoading: false,
  deleteUserMapLoading: false,
  listUserMapsLoading: false
}

export default function reducer(state=initialState, action={}) {
  switch (action.type) {

    case STAGE_ADD_NEW_NODE:
      const { node, parentUuid } = action;
      let currentNodes = state.stageNodes.slice();

      if(parentUuid) {
        traverseItems(currentNodes, (n) => {
          if(n.uuid === parentUuid) {
            n.items.push(node);
          }
        });
      } else {
        node.root = true;
        currentNodes = [node];
      }

      return {
        ...state,
        stageNodes: currentNodes
      }

    case STAGE_REMOVE_NODE:
      currentNodes = state.stageNodes.slice();
      const i = currentNodes.findIndex(n => {
        return n.uuid === action.node.uuid;
      });

      if (i >= 0) {
        currentNodes.splice(i, 1);
      } else {
        traverseItems(currentNodes, (n) => {
          const j = n.items.findIndex((n) => {
            return n.uuid === action.node.uuid;
          });
          if (j >= 0) {
            n.items.splice(j, 1);
          }
        });
      }

      return {
        ...state,
        stageNodes: currentNodes
      };

    case STAGE_SET_NODES:
      return {
        ...state,
        stageNodes: action.stageNodes
      };

    case STAGE_CLEAN_NODES:
      return {
        ...state,
        stageNodes: []
      }

    case SAVE_SHARED_MAP:
      return {
        ...state,
        saveSharedLoading: true,
        latestSharedMapKey: null
      }

    case SAVE_SHARED_MAP_SUCCESS:
      return {
        ...state,
        saveSharedLoading: false,
        latestSharedMapKey: action.result.data.mapKey
      }

    case SAVE_SHARED_MAP_FAIL:
      return {
        ...state,
        saveSharedLoading: false,
        latestSharedMapKey: null
      }

    case GET_SHARED_MAP:
      return {
        ...state,
        getSharedLoading: true
      }

    case GET_SHARED_MAP_SUCCESS:
      return {
        ...state,
        getSharedLoading: false,
        stageNodes: JSON.parse(action.result.data)
      }

    case GET_SHARED_MAP_FAIL:
      return {
        ...state,
        getSharedLoading: false,
        stageNodes: []
      }

    case SAVE_USER_MAP:
      console.log('save user map...');
      return {
        ...state,
        saveUserMapLoading: true,
        latestUserMapKey: null
      }

    case SAVE_USER_MAP_SUCCESS:
      const newMap = action.result.data;
      let uMaps = state.userMaps;

      let hasKey = false;
      for (let i=0, l=uMaps.length; i<l; i++) {
        if (uMaps[i].key === newMap.key) {
          hasKey = true;
        }
      }

      return {
        ...state,
        saveUserMapLoading: false,
        latestUserMapKey: newMap.key,
        userMaps: hasKey ? [...uMaps] : [...uMaps, newMap]
      }

    case SAVE_USER_MAP_FAIL:
      return {
        ...state,
        saveUserMapLoading: false,
        latestUserMapKey: null
      }

    case GET_USER_MAP:
      console.log('get user map...');
      return {
        ...state,
        getUserMapLoading: true,
        stageNodes: []
      }

    case GET_USER_MAP_SUCCESS:
      return {
        ...state,
        getUserMapLoading: false,
        stageNodes: action.result.data
      }

    case GET_USER_MAP_FAIL:
      return {
        ...state,
        getUserMapLoading: false,
        stageNodes: []
      }

    case DELETE_USER_MAP:
      console.log('delete user map...');
      return {
        ...state,
        deleteUserMapLoading: true
      }

    case DELETE_USER_MAP_SUCCESS:
      const deletedKey = action.result.data.deletedKey;
      let maps = [...state.userMaps];

      for (let j=0, k=maps.length; j<k; ++j) {
        if (maps[j].key === deletedKey) {
          maps.splice(j, 1);
          break;
        }
      }

      return {
        ...state,
        deleteUserMapLoading: false,
        userMaps: maps
      }

    case DELETE_USER_MAP_FAIL:
      return {
        ...state,
        deleteUserMapLoading: false
      }

    case LIST_USER_MAPS:
      console.log('list user maps...');
      return {
        ...state,
        listUserMapsLoading: true,
        userMaps: []
      }

    case LIST_USER_MAPS_SUCCESS:
      const items = action.result.data;
      const newItems = Object.keys(items).map((k) => {
        let name = '';
        if (0 in items[k]) {
          name = items[k][0]["name"];
        }
        return { key: k, name: name, content: items[k] };
      });

      return {
        ...state,
        listUserMapsLoading: false,
        userMaps: newItems
      }

    case LIST_USER_MAPS_FAIL:
      return {
        ...state,
        listUserMapsLoading: false,
        userMaps: []
      }

    default:
      return state;
  }
}

export function addNewStageNode(node, parentUuid) {
  return {
    type: STAGE_ADD_NEW_NODE,
    node,
    parentUuid
  };
}

export function addStageNode(node, parentUuid, setCurrent=false) {
  return (dispatch, getState) => {
    if (stageHasNode(getState().stage.stageNodes, { node, parentUuid })) {
      dispatch(setCurrentNode(node));
      return;
    }
    node.uuid = uuid();
    node.items = node.items || [];
    dispatch(addNewStageNode(node, parentUuid));
    if (setCurrent) {
      dispatch(setCurrentNode(node));
    }
  }
}

export function removeStageNode(node) {
  return {
    type: STAGE_REMOVE_NODE,
    node
  }
}

export function setStageNodes(stageNodes) {
  return {
    type: STAGE_SET_NODES,
    stageNodes
  }
}

export function cleanStageNodes() {
  return {
    type: STAGE_CLEAN_NODES
  }
}

export function saveSharedMap(stageNodes) {
  return {
    types: [SAVE_SHARED_MAP, SAVE_SHARED_MAP_SUCCESS, SAVE_SHARED_MAP_FAIL],
    promise: (client) => client.post('/api/maps/shared', { value: stageNodes })
  };
}

export function getSharedMap(key) {
  return {
    types: [GET_SHARED_MAP, GET_SHARED_MAP_SUCCESS, GET_SHARED_MAP_FAIL],
    promise: (client) => client.get(`/api/maps/shared/${key}`)
  };
}

export function saveUserMap(stageNodes) {
  return {
    types: [SAVE_USER_MAP, SAVE_USER_MAP_SUCCESS, SAVE_USER_MAP_FAIL],
    promise: (client) => client.post('/api/maps/user', { value: stageNodes })
  };
}

export function getUserMap(key) {
  return {
    types: [GET_USER_MAP, GET_USER_MAP_SUCCESS, GET_USER_MAP_FAIL],
    promise: (client) => client.get(`/api/maps/user/${key}`)
  };
}

export function deleteUserMap(key) {
  return {
    types: [DELETE_USER_MAP, DELETE_USER_MAP_SUCCESS, DELETE_USER_MAP_FAIL],
    promise: (client) => client.delete(`/api/maps/user/${key}`)
  };
}

export function listUserMaps() {
  return {
    types: [LIST_USER_MAPS, LIST_USER_MAPS_SUCCESS, LIST_USER_MAPS_FAIL],
    promise: (client) => client.get(`/api/maps/user`)
  };
}

// Selectors?
export function stageHasNode(stageNodes, { node, parentUuid }) {
  let ids = stageNodes.map(n => n._id);
  if (parentUuid !== undefined) {
    traverseItems(stageNodes, (n) => {
      if (n.uuid === parentUuid) {
        ids = n.items.map(n => n._id);
      }
    });
  }
  return !(ids.indexOf(node._id) < 0);
}

export function getStageNode(stageNodes, { node, parentUuid }) {
  let foundNode = false;
  traverseItems(stageNodes, (n) => {
    if(n.uuid === node.uuid) {
      foundNode = n;
    }
  });
  if (!foundNode && parentUuid !== undefined) {
    traverseItems(stageNodes, (n) => {
      if (n.uuid === parentUuid) {
        for (let i in n.items) {
          if (node._id === n.items[i]._id) {
            foundNode = n.items[i];
          }
        }
      }
    });
  }
  return foundNode;
}
