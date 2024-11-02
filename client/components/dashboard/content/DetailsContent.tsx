import React from 'react';
import { useProfile } from '../../../providers/ProfileProvider';
import { SquarePenIcon, StarIcon } from 'lucide-react';
import ConnectionCard from './ConnectionCard';


const DetailsContent = () => {
  const { selectedDetail, profileTabs } = useProfile();

  const listQuotes = [
    "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
    "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
    "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."
  ]

  return (
    <div className='p-4 relative'>
      <SquarePenIcon className=' w-5 h-5 cursor-pointer absolute top-4 right-4' />
      {profileTabs === 'Personal Details' &&  
      <>
      <h2 className='text-xl font-bold'>{selectedDetail}</h2>
      <div className='mt-4'>
        {
          selectedDetail === 'General Information' && (
          <>
            <h3 className='font-bold'>Name</h3>
            <p><strong>First Name:</strong> Jethro</p>
            <p><strong>Middle Name:</strong> Layan</p>
            <p><strong>Last Name:</strong> Cenas</p>
            <p><strong>Suffix:</strong> N/A</p>
            <h3 className='font-bold mt-4'>Birth Details</h3>
            <p><strong>Birth Date:</strong> January 01, 2002</p>
            <p><strong>Birth Place:</strong> Cebu City, Cebu, Visayas, PH</p>
            <p><strong>Birthing Center:</strong> Unknown</p>
            <h3 className='font-bold mt-4'>Citizenship</h3>
            <p><strong>Nationality:</strong> Filipino</p>
            <p><strong>Civil Status:</strong> Divorced</p>
          </>
        )}

        {
          selectedDetail === 'Addresses' && (
            <>
              <h4 className='font-bold text-lg'>Current Address</h4>
              <p>Residence Type: Home</p>
              <p>Street Address: 123 Main St</p>
              <p>City: Cebu City</p>
              <p>Province: Cebu</p>
              <p>Country: Philippines</p>
              <p>Postal Code: 6000</p>
            </>
          )
        }

        {
          selectedDetail === 'Vital Information' && (
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <h4 className='font-bold text-lg'>Physical Attributes</h4>
                  <p>Sex: Male</p>
                  <p>Height: 5&apos;10&quot;</p>
                  <p>Weight: 180 lbs</p>
                  <p>Eye Color: Brown</p>
                  <p>Hair Color: Black</p>
                  <p>Blood Type: O+</p>
                </div>
                {/* <div>
                  <h4 className='font-bold text-lg'>Birth Details</h4>
                  <p>Birth Date: January 01, 2002</p>
                  <p>Birth Place: Cebu City, Cebu, Visayas, PH</p>
                  <p>Birthing Center: Unknown</p>
                </div> */}
              </div>
              {/* <div>
                <h4 className='font-bold text-lg'>Citizenship</h4>
                <p>Nationality: Filipino</p>
                <p>Civil Status: Single</p>
              </div> */}
            </div>
          )
        }

        {
          selectedDetail === 'Personal Interests' && (
            <div>
              <h4 className='font-bold text-lg'>Interests</h4>
              <p>Hobbies: Reading, Writing, Gardening</p>
              <p>Favorite Books: To Kill a Mockingbird, 1984, Pride and Prejudice</p>
              <p>Favorite Movies: The Shawshank Redemption, The Godfather, Casablanca</p>
            </div>
          )
        }

        {
          selectedDetail === 'Contact Information' && (
            <>
              <div>
                <h4 className='font-bold text-lg'>Personal Contact</h4>
                <p>Email: jethro.cenas@example.com</p>
                <p>Phone: +63 912 345 6789</p>
              </div>

              <div>
                <h4 className='font-bold text-lg'>Emergency Contact</h4>
                <p>Name: Raiza J Pagatpatan</p>
                <p>Email: raiza.pagatpatan@example.com</p>
                <p>Relationship:Besto Friend</p>
                <p>Phone: +63 912 345 6789</p>
              </div>
            </>
          )
        }
      </div>
      </>
      }

      {
        profileTabs === 'Profile Memo' && (
          <div className=''>
            <h2 className='text-[1.5rem] font-bold'>Profile Memo</h2>
            <div className='mt-4 quotes'>
              <p className='text-center text-[2.5rem] w-[60%] mx-auto'>&quot;Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...&quot;</p>
            </div>
            <div>
              <h4 className='text-[1.2rem] font-bold'>About Me</h4>
              <p className='ml-8 mt-4'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc lorem sapien, luctus sit amet justo eu, vulputate tristique velit. Sed sit amet elit ornare, convallis urna non, lobortis est. Nulla mollis erat eu molestie aliquam. Nullam orci ipsum, faucibus at dolor a, hendrerit finibus massa. Phasellus interdum est sem, tristique pharetra metus consectetur non. Maecenas dignissim viverra augue, vel bibendum lorem tristique vitae. Phasellus ac euismod arcu. Morbi tempor vehicula ligula, pretium malesuada eros ultricies in.<br/><br/>
              Integer ut dui condimentum orci ultrices euismod et viverra eros. In hac habitasse platea dictumst. Etiam diam massa, vulputate a tortor ut, sodales hendrerit mauris. Maecenas a interdum augue, sit amet lacinia nulla. Donec a diam sed sem interdum euismod. Praesent ut sem mauris. Donec et fermentum justo.<br/><br/>
              Vestibulum risus eros, posuere in neque quis, fringilla laoreet urna. Phasellus et viverra est, vel commodo purus. Nulla a accumsan urna, sit amet molestie leo. Maecenas hendrerit dignissim augue, ac venenatis mi dapibus nec. Pellentesque facilisis dui a scelerisque porttitor. Nulla eget enim lorem. Mauris eu bibendum enim. Mauris diam justo, molestie quis magna et, ultricies volutpat turpis. Sed eros risus, egestas ut ipsum nec, interdum rutrum mauris. Suspendisse vel dictum nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus accumsan lectus nec ornare tempor.
              <br/><br/>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vulputate scelerisque felis, sit amet aliquet lectus convallis iaculis. Nunc convallis lacus dapibus augue luctus, at vehicula massa vulputate. Donec varius, neque fringilla ornare elementum, leo elit aliquet nunc, ut aliquet tortor est eget nisi. Proin non maximus orci. Aenean eget elit ut odio varius dapibus. Etiam sed rutrum tellus. Proin eget accumsan libero. Proin est augue, maximus eget arcu a, porttitor convallis leo. In nisi enim, euismod suscipit placerat quis, dictum at ipsum. Integer eget imperdiet libero.</p>
            </div>
            <div className='mt-6'>
              <h4 className='text-[1.2rem] font-bold'>Quotes</h4>
              <ol className='mt-4 list-decimal' style={{ listStyleType: 'decimal' }}>
                {
                  listQuotes.map((quote, index) => (
                    <li className='ml-10' key={index}>
                      <p className='flex items-center gap-2'>
                        {quote}
                      <StarIcon className='w-4 h-4' />
                      </p>
                    </li>
                  ))
                }
              </ol>
            </div>
          </div>
        )
      }


      {
        profileTabs === 'Connections' && (
          <div className=''>
            <h2 className='text-[1.5rem] font-bold'>Connections</h2>
            <div className='grid grid-cols-3 gap-4'>
              <ConnectionCard />  
              <ConnectionCard />  
              <ConnectionCard />  
              <ConnectionCard />  
              <ConnectionCard />  
              <ConnectionCard /> 
              <ConnectionCard />  
              <ConnectionCard />  
              <ConnectionCard /> 
            </div>
          </div>
        )
      }
    </div>
  );
};

export default DetailsContent;
