import { updateProfile, sendProfile } from '../controllers/profileController';
import { Profile } from '../models/Profile';
import { User } from '../models/User';

const mockRequest = () => {
    return {
        user: { id: 'userId123' },
        body: { name: 'New Name' }
    };
};

const mockResponse = () => {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    };
};

const mockUser = {
    _id: 'userId123',
    name: 'john dow',
    email: 'email@email.com',
    password: '2zaq3xsw4ced5rvf6tbg7ynh8umji,'
};

const mockProfile = {
    _id: 'profileId123',
    username: 'name',
    currentTotalIncome: 0,
    goalAmount: 0,
    userId: mockUser._id,
};

jest.mock('../utils/jwt', () => ({
    createtoken: jest.fn(() => 'jwt_token'),
}));

describe('Profile Controller', () => {
    describe('updateProfile', () => {
        it('should update the profile and return success message', async () => {
            jest.spyOn(Profile, 'findOneAndUpdate').mockResolvedValueOnce(mockProfile);

            const req = mockRequest();
            const res = mockResponse();

            await updateProfile(req, res);

            expect(Profile.findOneAndUpdate).toHaveBeenCalledWith(
                { userId: 'userId123' },
                { $set: { name: 'New Name' } },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Profile updated successfully',
                profile: mockProfile
            });
        });

        it('should return 404 if profile not found', async () => {
            jest.spyOn(Profile, 'findOneAndUpdate').mockResolvedValueOnce(null);

            const req = mockRequest();
            const res = mockResponse();

            await updateProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Profile not found' });
        });

        it('should return 500 if there is an error', async () => {
            jest.spyOn(Profile, 'findOneAndUpdate').mockRejectedValueOnce(new Error('Error updating profile'));

            const req = mockRequest();
            const res = mockResponse();

            await updateProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error updating profile' });
        });
    });

    describe('sendProfile', () => {
        it('should send the profile and return success message', async () => {
            jest.spyOn(Profile, 'findOne').mockResolvedValueOnce(mockProfile);

            const req = mockRequest();
            const res = mockResponse();

            await sendProfile(req, res);

            expect(Profile.findOne).toHaveBeenCalledWith({ userId: 'userId123' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Profile send successfully',
                profile: mockProfile
            });
        });

        it('should return 404 if profile not found', async () => {
            jest.spyOn(Profile, 'findOne').mockResolvedValueOnce(null);

            const req = mockRequest();
            const res = mockResponse();

            await sendProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Profile not found' });
        });

        it('should return 500 if there is an error', async () => {
            jest.spyOn(Profile, 'findOne').mockRejectedValueOnce(new Error('Error sending profile'));

            const req = mockRequest();
            const res = mockResponse();

            await sendProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error sending profile' });
        });
    });
});
