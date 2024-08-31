import { User } from "../models/User"
import { subscribeToNewsletter } from "./newsletterController"


const mockRequest = () => {
    return {
        user: {
            id: 1,
        }
    }
}


const mockResponse = () => {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    };
};

jest.mock("../middleware/newsletter.js",()=>({
    sendConfirmationEmail : jest.fn()
}))

describe("subscribe to mail", () => {
    it("shoud not finde a user", async () => {
        jest.spyOn(User, "findByIdAndUpdate").mockResolvedValueOnce(null)
        const req = mockRequest()
        const res = mockResponse()
        await subscribeToNewsletter(req, res)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found' })
    })
    it("shoud send mail", async () => {
        jest.spyOn(User, "findByIdAndUpdate").mockResolvedValueOnce(true)
        const req = mockRequest()
        const res = mockResponse()
        await subscribeToNewsletter(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ message: 'Successfully subscribed to the newsletter' })
    })
}) 