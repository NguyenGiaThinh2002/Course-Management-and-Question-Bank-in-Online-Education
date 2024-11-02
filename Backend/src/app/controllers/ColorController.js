const Colors = require("../models/Color")

class ColorController {
    async createColors(req, res){
        try {
            const {userID, sidebarColor, headerColor} = req.body;
            const userColor = await Colors.findOne({userID: userID});
            if(userColor){
                const newUserColors = await Colors.findOneAndUpdate({userID: userID}, {sidebarColor: sidebarColor, headerColor: headerColor});
                return res.status(201).json(newUserColors)
            }else{
                const createdColors = await Colors.create({userID, sidebarColor, headerColor});
                return res.status(201).json(createdColors)
            }
            
            // const createdColors = await Colors.create({userID, sidebarColor, headerColor});
            // return res.status(201).json(createdColors)
        } catch (error) {
            return res.status(400).json("khong the tao mau")
        }   
    }

    async getColors(req, res){
        try {
            // const userColor = await Colors.findOne({where: {userID : req.params.id}}); 
            const userID = req.params.userID;
            const userColor = await Colors.findOne({userID: userID}); 
            if(!userColor) return res.status(404).send('Khong tim thay thanh ngien nguoi dung nao');
            return res.status(200).json(userColor)
        } catch (error) {
            console.log(error)      
        }
    }
}

module.exports = new ColorController;