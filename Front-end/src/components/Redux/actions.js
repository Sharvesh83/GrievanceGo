import { GET_DETAILS, UPDATE_CHATS, RESOLVE_COMPLAINT } from './action.type'

const Registration = data => {
    const dataobj = {
        name: data.name,
        wardno: data.wardno,
        phoneno: data.phoneno,
        arealimit: data.arealimit,
        subject: data.subject,
        department: data.department,
        address: data.address,
        description: data.description,
        userId: data.userId, // Auth0 sub
        createdBy: data.createdBy, // Auth0 email
    }
    return async dispatch => {
        try {
            let url = await fetch('http://localhost:3000/api/addinfo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataobj),
            })
            let res = await url.json()
            console.log(res)

            dispatch({
                type: UPDATE_CHATS,
                payload: res,
            })
        } catch (error) {
            console.log(error)
        }
    }
}

let getinfo = (userId) => {
    return async dispatch => {
        try {
            let urlStr = 'http://localhost:3000/api/info';
            if (userId) {
                urlStr += `?userId=${userId}`;
            }
            let url = await fetch(urlStr, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })
            let inf = await url.json()
            console.log('action data received', inf)

            dispatch({
                type: GET_DETAILS,
                payload: inf,
            })
        } catch (error) {
            console.log(error)
        }
    }
}

const addingchat = data => {
    const dataobj = {
        chat: data.chat,
        id: data._id,
    }
    return async dispatch => {
        try {
            let url = await fetch('http://localhost:3000/api/addchat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataobj),
            })

            let res = await url.json()

            console.log(res)

            dispatch({
                type: UPDATE_CHATS,
                payload: res,
            })

            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }
}
const resolveComplaint = complaintId => {
    return async dispatch => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/updatestatus`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: complaintId }),
                }
            )

            const updatedComplaints = await response.json()

            dispatch({
                type: RESOLVE_COMPLAINT,
                payload: {
                    complaintId,
                    updatedComplaints,
                },
            })
        } catch (error) {
            console.log(error)
        }
    }
}

export { Registration, getinfo, addingchat, resolveComplaint }
