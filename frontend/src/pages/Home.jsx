import image from '../assets/images/Image-1.jpeg'
import image2 from '../assets/images/Image-2.jpeg'
import interactiveImage from '../assets/images/interactive.jpg'

const Home = () => {
  return (
    <div>
      <section id='home'>
          <div className='hero-section'>
            <div className="flex flex-col md:flex-row text-white justify-around items-center space-x-0 md:space-x-8 py-48 px-8">
              <div className="mb-8 md:mb-0 md:w-1/2">
                  <h4 className="text-3xl font-bold mb-4">Welcome to <span className="text-green-400">BUDGETI</span></h4>
                  <h5 className="text-xl font-semibold mb-4">Our mission at Budgetti is to help you lead a richer life.</h5>
                  <p className="text-base leading-6">Building a picture of all your assets, monitoring your money and controlling your spending has one purpose, and one purpose only: to lead to a richer life.</p>
              </div>
              <div className="relative md:w-1/2 flex justify-center items-center">
                  <div className="relative w-72 h-72">
                      <img src={image} className="absolute top-0 left-0 w-full h-full transform rotate-12 shadow-lg" />
                      <img src={image2} className="absolute top-0 left-0 w-full h-full transform -translate-x-8 translate-y-8 -rotate-45 shadow-lg" />
                  </div>
              </div>
          </div>
        </div>
      </section>

    <section id='feature'>
      <div className='relative container flex flex-col max-w-6xl mx-auto my-32 px-6 text-gray-900 md:flex-row md:px-0'>
        <img src={interactiveImage} alt="" />
        <div className="top-48 pr-0 bg-white md:absolute md:right-0 md:py-20 md:pl-20">
          <h2 className='max-w-lg mt-10 mb-6 font-sans text-4xl text-center text-gray-900 uppercase md:text-5xl md:mt-0 md:text-left'>
            Manually Input and Categorize
          </h2>
          <p className='max-w-md text-center md:text-left'>You can manually input cash transactions, and correct automatic categorizations</p>
        </div>
      </div>
    </section>
    </div>
  )
}

export default Home