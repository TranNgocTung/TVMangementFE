import { initializeApp  } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
        apiKey: "AIzaSyAvmBqHB4Bhac90IfjMrdLcyt8fkagVias",
        authDomain: "fivewing1196.firebaseapp.com",
        databaseURL: "https://fivewing1196-default-rtdb.firebaseio.com",
        projectId: "fivewing1196",
        storageBucket: "fivewing1196.appspot.com",
        messagingSenderId: "559613890320",
        appId: "1:559613890320:web:13ebd48ad53eb804511f95",
        measurementId: "G-3D4ZV5T6VL"
};

initializeApp(firebaseConfig);

const storage = getStorage()
export default storage;
