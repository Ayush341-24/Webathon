import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore";



export const api = {
    // Auth - Firebase
    register: async (userData: any) => {
        try {
            const { email, password, name, role, ...otherData } = userData;
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update Auth Profile
            await updateProfile(user, { displayName: name });

            // Create User Document in Firestore
            const userDoc = {
                uid: user.uid,
                name,
                email,
                role,
                ...otherData,
                badges: role === 'user' ? ['Newbie'] : [],
                coupons: [],
                points: 0,
                createdAt: new Date(),
            };

            await setDoc(doc(db, "users", user.uid), userDoc);

            return { ...userDoc, token: await user.getIdToken() };
        } catch (error: any) {
            throw new Error(error.message);
        }
    },
    login: async (credentials: any) => {
        try {
            const { email, password } = credentials;
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Get User Data from Firestore
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                return { ...userDocSnap.data(), token: await user.getIdToken() };
            } else {
                // Fallback if doc doesn't exist (legacy/error)
                return {
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName,
                    token: await user.getIdToken()
                };
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    },
    logout: async () => {
        await signOut(auth);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },

    // User Profile - Firebase
    getProfile: async () => {
        const user = auth.currentUser;
        if (!user) throw new Error("Not authenticated");

        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            return userDocSnap.data();
        }
        return null;
    },
    updateProfile: async (data: any) => {
        const user = auth.currentUser;
        if (!user) throw new Error("Not authenticated");

        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, data);

        // Return updated data
        const updatedSnap = await getDoc(userDocRef);
        return updatedSnap.data();
    },

    // Helpers
    getHelpers: async (params: any) => {
        const usersRef = collection(db, "users");
        let q = query(usersRef, where("role", "==", "helper"));

        if (params?.serviceType) {
            q = query(q, where("serviceType", "==", params.serviceType));
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    updateLocation: async (location: { lat: number; lng: number }) => {
        const user = auth.currentUser;
        if (!user) throw new Error("Not authenticated");

        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { location });
    },

    // Bookings
    createBooking: async (bookingData: any) => {
        const user = auth.currentUser;

        // Demo Fallback: Allow booking even if not logged in
        const booking = {
            userId: user?.uid || "guest_user_id",
            userName: user?.displayName || "Guest User",
            ...bookingData,
            status: 'pending',
            createdAt: new Date(),
        };
        const docRef = await addDoc(collection(db, "bookings"), booking);
        return { id: docRef.id, ...booking };
    },
    getBooking: async (id: string) => {
        const docRef = doc(db, "bookings", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as any;
        }
        throw new Error("Booking not found");
    },
    getMyBookings: async () => {
        const user = auth.currentUser;
        if (!user) throw new Error("Not authenticated");

        const bookingsRef = collection(db, "bookings");
        const q = query(bookingsRef, where("userId", "==", user.uid));

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
};

// Mock socket for now to prevent breakage
// Mock socket removed - Use Firestore onSnapshot instead
// export const socket = {
//     on: (event: string, callback: any) => { },
//     emit: (event: string, data?: any) => { },
//     off: (event: string) => { },
// };

