import { UPDATE_CHATS, GET_DETAILS, RESOLVE_COMPLAINT } from './action.type'

const initialState = {
    info: [],
}

function reducer(state = initialState, { type, payload }) {
    switch (type) {
        case GET_DETAILS:
            return {
                ...state,
                info: payload,
            }

        case UPDATE_CHATS:
            return {
                ...state,
                info: payload,
            }

        case RESOLVE_COMPLAINT:
            const updatedInfo = state.info.map(complaint =>
                complaint._id === payload.complaintId &&
                complaint.status !== 'Resolved'
                    ? {
                          ...complaint,
                          status: 'Resolved',
                          resolvedOn: new Date(),
                      }
                    : complaint
            )
            return {
                ...state,
                info: updatedInfo,
            }

        default:
            return state
    }
}

export default reducer
