import Navbar from "../../components/Navbar/Navbar";
import HeroBanner from "../../components/HeroBanner/HeroBanner";
import CategorySection from "../../components/CategorySection/CategorySection";
import FeaturedProducts from "../../components/FeaturedProducts/FeaturedProducts";
import NewArrivals from "../../components/NewArrivals/NewArrivals";
import OfferBanner from "../../components/OfferBanner/OfferBanner";
import WhyUs from "../../components/WhyUs/WhyUs";


function Home(){

  return(
    <>
      <HeroBanner />
      <CategorySection/>
      <FeaturedProducts />
      <NewArrivals />
      <OfferBanner />
      <WhyUs />
      
    </>
  )
}
export default Home;