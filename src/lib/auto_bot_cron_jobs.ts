// cron-job.ts
import { CronJob } from 'cron';
import { incrementAutobot } from '../services/user.services';

let job: CronJob | null = null;
let jobStartTime: number | null = null;
const JOB_DURATION = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

export function startCronJob(): void {
    if (job) {
        // console.log('Auto bot Cron job is already running.');
        return;
    }

    jobStartTime = Date.now();
    job = new CronJob('* * * * * *', async () => {
        // console.log('Auto bot Cron job running every second.');
        await incrementAutobot()

        // Check if 24 hours have passed
        if (Date.now() - (jobStartTime ?? 0) >= JOB_DURATION) {
            stopCronJob();
        }
    }, null, true);

    console.log('Auto bot Cron job started.');
}

export function stopCronJob(): void {
    if (job) {
        job.stop();
        job = null;
        console.log('Auto bot Cron job stopped.');
    } else {
        console.log('No Auto bot cron job is running.');
    }
}
