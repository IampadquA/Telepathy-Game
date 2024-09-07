const functions = require('firebase-functions');
const {
    getAllPlayerIds, 
    getInventory,
    sendInvite,
    deleteInvite,
    createLobby,
    deleteLobbyByUid,
    updateLobbyStatus,
    setPlayerStatus,
    updatePlayerStatus,
    updateInvitationStatus,
} = require('./FirebaseFunctions/firebasefunctions.js');

exports.getAllPlayerIds = getAllPlayerIds;
exports.getInventory = getInventory;
exports.sendInvite = sendInvite;
exports.deleteInvite = deleteInvite;
exports.createLobby = createLobby;
exports.deleteLobbyByUid = deleteLobbyByUid;
exports.updateLobbyStatus = updateLobbyStatus;
exports.setPlayerStatus = setPlayerStatus;
exports.updatePlayerStatus = updatePlayerStatus;
exports.updateInvitationStatus = updateInvitationStatus;