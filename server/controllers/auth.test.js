import bcrypt from 'bcryptjs';
import { registerUser, loginUser } from "./authController.js"
import { User } from "../models/User.js"
import { Profile } from '../models/Profile.js';

const mockRequest =()=> {
    return {
        body: {
            name: "john dow",
            email: "email@gmail.com",
            password: "password123"
        }
    }
}
const mocklogRequest = {
    body: {
        email: "email@gmail.com",
        password: "password123"
    }
}

const mockResponse = () => {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    };
};


const mockUser = {
    _id: "59b99db4cfa9a34dcd7885b6",
    name: "john dow",
    email: "email@email.com",
    password: "2zaq3xsw4ced5rvf6tbg7ynh8umji,"
}

const mockProfile = {
    _id: "59b99db4cfa9a34dcd7885b",
    username: "name",
    currentTotalIncome: 0,
    goalAmount: 0,
    userId: mockUser._id,
}


jest.mock('../utils/jwt', () => ({
    createtoken: jest.fn(() => 'jwt_token'),
}));

describe("regester user", () => {
    it("should register user", async () => {
        jest.spyOn(User, "findOne").mockResolvedValueOnce(false)
        jest.spyOn(bcrypt, "hash").mockResolvedValueOnce("2zaq3xsw4ced5rvf6tbg7yn h8umji,");
        jest.spyOn(User, "create").mockResolvedValueOnce(mockUser);
        jest.spyOn(Profile, "create").mockResolvedValueOnce(mockProfile);
        // console.log(mockRequest);

        const mockRes = mockResponse();
        await registerUser(mockRequest(), mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(201)
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'User registered successfully', token: 'jwt_token' });
    })
})

describe("logein user ", () => {
    it("should not found a user", async () => {
        jest.spyOn(User, "findOne").mockResolvedValueOnce(null);
        // const mockReq = mockRequest().body = { body: { email: " ewrr", password: "wrewrewr " } }
        const mockRes = mockResponse()
        await loginUser(mocklogRequest, mockRes)
        expect(mockRes.status).toHaveBeenCalledWith(400)
        expect(mockRes.json).toHaveBeenCalledWith({ "error": "Invalid credentials" })
    })
    it("password shoud not be the same", async () => {
        jest.spyOn(User, "findOne").mockResolvedValueOnce(mocklogRequest);
        jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(null)
        const mockRes = mockResponse()
        await loginUser(mocklogRequest, mockRes)
        expect(mockRes.status).toHaveBeenCalledWith(400)
        expect(mockRes.json).toHaveBeenCalledWith({ "error": "Invalid credentials" })
    })
    it("invalid inputs", async () => {
        const mockReq = mockRequest().body = { body: { email: "", password: "" } };
        const mockres = mockResponse();
        await loginUser(mockReq, mockres);
        expect(mockres.status).toHaveBeenCalledWith(400);
        expect(mockres.json).toHaveBeenCalledWith({ error: 'enter you email and password' })
    })
    it("all the valies are corect ", async()=>{
        const mockreq = mockRequest().body ={body:{email:"email@email.com",password:"wxerdctvbyugnmio,p"}};
        jest.spyOn(User, "findOne").mockResolvedValueOnce(mockUser);
        jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(true)
        const mockRes = mockResponse();
        // console.log();
        
        await loginUser(mockreq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Login successful', token: 'jwt_token'}) 
    })
})