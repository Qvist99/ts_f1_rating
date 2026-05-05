
export default async function DriverRankingOverview() {
    await new Promise(resolve => setTimeout(resolve, 2000))

    // TODO


    // Have a slider where one slide shows top X drivers last 3 races and the next slide show the worst X drivers last 3 races
    // Need a way too determine what the last 3 races of the season was. Could be done by fetching the closes 3 races to the current date based on the date field in supabase and take these id's and query the ratings table for ratings from these 3 races
    // Add year too the ratings so we can filter out ratings for future years and maybe compare seasons

    // Maybe need some way too add team logos for each driver aswell as we only have the headshots at the moment. Could add a team field that just have link too logo and the driver numbers that use this logo. This way I can link the drivers too the logo in my seeding function.

    // Just a normal list view of the drivers, avg rating, and maybe display the team logo in some way

    // A button that opens a modal that shows all the drivers rated in order

    return (
        <div>DriverRankingOverview</div>
    )
}
