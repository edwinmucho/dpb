/**
 * Copyright 2017 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';
var Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk
var config = require('../util/config');
var request = require('request');
// Create a Service Wrapper
var conversation = new Conversation(config.conversation);
var getConversationResponse = (message, context) => {
    var payload = {
        workspace_id: process.env.WORKSPACE_ID
        , context: context || {}
        , input: message || {}
    };
    payload = preProcess(payload);
    return new Promise((resolved, rejected) => {
        // Send the input to the conversation service
        conversation.message(payload, function (err, data) {
            if (err) {
                rejected(err);
            }
            resolved(postProcess(data));
        });
    })
}
var postMessage = (req, res) => {
        var message = req.body.input || {};
        var context = req.body.context || {};
        getConversationResponse(message, context).then(data => {
            return res.json(data);
        }).catch(err => {
            return res.status(err.code || 500).json(err);
        });
    }
    /** 
     * 사용자의 메세지를 Watson Conversation 서비스에 전달하기 전에 처리할 코드
     * @param  {Object} user input
     */
var preProcess = payload => {
        var inputText = payload.input.text;
        console.log("User Input : " + inputText);
        console.log("Processed Input : " + inputText);
        console.log("--------------------------------------------------");
        return payload;
    }
    /** 
     * Watson Conversation 서비스의 응답을 사용자에게 전달하기 전에 처리할 코드 
     * @param  {Object} watson response 
     */
let postProcess = response => {
        console.log("Conversation Output : " + response.output.text);
        console.log("--------------------------------------------------");
        //if (response.context && response.context.action) {
            //return doAction(response, response.context.action);
        return response
        //}
    }
    /** 
     * 대화 도중 Action을 수행할 필요가 있을 때 처리되는 함수
     * @param  {Object} data : response object
     * @param  {Object} action 
     */
let doAction = (data, action) => {
    console.log("Action : " + action.command);
//    switch (action.command) {
//    case "check-availability":
//        return checkAvailability(data, action);
//        break;
//    case "confirm-reservation":
//        return confirmReservation(data, action);
//        break;
//        // 사용자의 예약 리스트를 가져옵니다.
//    case "check-reservation":
//        return checkReservation(data, action);
//        break;
//        // 사용자의 예약 리스트 중 가장 빠른 시간의 예약만 가져옵니다. 
//    case "check-next-reservation":
//        return checkNextReservation(data, action);
//        break;
//        // 예약 취소의 목적으로 예약 리스트를 가져옵니다.
//    case "check-reservation-for-cancellation":
//        return checkReservation(data, action).then(data => {
//            if (Array.isArray(data.output.text)) {
//                data.output.text.unshift("Please tell me the number of the reservation you want to cancel.");
//            }
//            return data;
//        });
//        break;
//        // 예약을 취소합니다.
//    case "confirm-cancellation":
//        return confirmCancellation(data, action);
//        break;
//    default:
//        console.log("Command not supported.")
//    }
}
module.exports = {
    'initialize': (app, options) => {
        app.post('/api/message', postMessage);
    }
    , 'getConversationResponse': getConversationResponse
};