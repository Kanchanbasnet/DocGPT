import cron from 'node-cron';

cron.schedule('*/10 * * * * *', async () => {
  try {

    
    
      }
    
  catch (error) {
    console.info(`An error has been occured.`, error)
    throw error
  }
})