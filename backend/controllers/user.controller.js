import User from "../models/user.model.js";

export const getUser = async (req, res) => { 
    
    try {
        const userId = req.userId;

        //find user by id
        const user = await User.findById(userId).select("-password");
        if(!user) return res.status(404).json({message: "User not found"});
        return  res.status(200).json({user});
        
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ message: "Server Error" });
        
    }
 }