import {connect} from 'mongoose'; 
import {disconnect} from 'mongoose';
export default async function connectToDatabase() {
    try {
        await connect(process.env.MONGODB);
    }catch(error){
        console.log(error);
        throw new Error('Error while connecting to database');
    }
}

async function disconnectFromDatabase() {
    try {
        await disconnect();

    }catch(error){
        console.log(error);
        throw new Error('Error while disconnecting from database');
    }
}

export {connectToDatabase,disconnectFromDatabase}