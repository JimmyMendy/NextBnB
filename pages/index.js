import Head from 'next/head'
import { connectToDatabase } from '../util/mongodb'

export default function Home({ properties }) {
  //console.log(properties);

  const book = async (property) => {
    const data = fetch(`http://localhost:3000/api/book?property_id=${property._id}&guest=Jimmy`)

    const res = await data
    console.log(res);
  }
  return (
    <div>
      <Head>
        <link rel="stylesheet" href=""/>
        <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet" />
      </Head>

      <div class="container mx-auto">
        <div class="flex">
          <div class="row w-full text-center my-4">
            <h1 class="text-4xl font-bold mb-5">NextBnB</h1>
          </div>
        </div>
        <div class="flex flex-row flex-wrap">
          {properties && properties.map(property => (
            <div key={property._id} class="flex-auto w-1/4 rounded overflow-hidden shadow-lg m-2">
              <img src={property.image} alt={property.name}/>
              <div class="px-6 py-4">
                <div class="font-bold text-xl mb-2">{property.name} (Up to {property.guests} guests)</div>
                <p>{property.address.street}</p>
                <p class="text-gray-700 text-base">
                  {property.summary}
                </p>
              </div>

              <div class="text-center py-2 my-2 font-bold">
                <span class="text-green-500">${property.price}</span>/night
              </div>

              <div className="text-center py-2 my-2">
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-5 rounded"
                onClick={() => book(property)}>Book</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const { db } = await connectToDatabase();
  const data = await db.collection('listingsAndReviews')
    .find({})
    .limit(20)
    .toArray();

    const properties = JSON.parse(JSON.stringify(data));

    const filtered = properties.map(property => {
      const price = JSON.parse(JSON.stringify(property.price))
      return { //props
        _id: property._id,
        name: property.name,
        image: property.images.picture_url,
        address: property.address,
        summary: property.summary,
        guests: property.accommodates,
        price: price.$numberDecimal
      }
    })
    //console.log(properties);
  return {
    props: { properties: filtered },
  }
}
