import bodyParser from 'body-parser';
import express, { Application, NextFunction, Request, Response } from 'express';
import { verifyAuthenticUser } from './middleware/auth';
import albumRouter from './routes/album.route';
import artistRouter from './routes/artist.route';
import authRouter from './routes/auth.route';
import songRouter from './routes/song.route';

require('dotenv').config();

const app: Application = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// App Home Route
app.get('/', (req: Request, res: Response) => {
    return res.send("Welcome to our Music Library System!");
});

app.use('/api/auth', authRouter);
app.use('/api/artists', verifyAuthenticUser, artistRouter);
app.use('/api/albums', verifyAuthenticUser, albumRouter);
app.use('/api/songs', verifyAuthenticUser, songRouter);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next) => {
    return res.status(404).json({
        message: "No such route exists"
    })
});

// error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    return res.status(500).json({
        message: "Something went wrong"
    })
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});