const functions = require('firebase-functions');
const {
    getAllPlayerIds, 
    getInventory,
    sendInvite,
    deleteInvite,
    createLobby,
    deleteLobbyByUid,
    updateLobbyStatus,
    updatePlayerStatus,
    updateInvitationStatus,
    searchWaitingLobby,
    getPlayerUidTest,
    joinTheLobby,
    addToTheRef,
    deleteLobbyRef,
} = require('./FirebaseFunctions/firebasefunctions.js');

exports.getAllPlayerIds = getAllPlayerIds;
exports.getInventory = getInventory;
exports.sendInvite = sendInvite;
exports.deleteInvite = deleteInvite;
exports.createLobby = createLobby;
exports.deleteLobbyByUid = deleteLobbyByUid;
exports.updateLobbyStatus = updateLobbyStatus;
exports.updatePlayerStatus = updatePlayerStatus;
exports.updateInvitationStatus = updateInvitationStatus;
exports.searchWaitingLobby = searchWaitingLobby;
exports.getPlayerUidTest = getPlayerUidTest;
exports.joinTheLobby = joinTheLobby;
exports.addToTheRef = addToTheRef;
exports.deleteLobbyRef = deleteLobbyRef;