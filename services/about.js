import nedb from 'nedb-promises'

const database = new nedb({filename: 'about.db'})

const about = [
    {

      "id":1,
      "title":"About Us",
      "about":"AirBeans' fleet of drones is equipped with advanced navigation systems, ensuring precise and reliable deliveries. These drones are designed to handle varying weather conditions, making them a dependable option for coffee lovers, rain or shine. The drones operate on an efficient and environmentally friendly electric power system, reducing the carbon footprint associated with conventional delivery methods."
 
   }

]

// THE ABOUT US IS SHOWN TO THE USER
// database.insert(about)
async function showAbout() {
    try {
        const about = await database.find({})
        return about
    } catch (error) {
        console.error(error)
    }

}

export { showAbout }