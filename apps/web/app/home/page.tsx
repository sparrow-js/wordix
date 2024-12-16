import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AiFillApi } from "react-icons/ai";
import { FaRunning } from "react-icons/fa";
import { IoDocument } from "react-icons/io5";
import { IoLanguageSharp } from "react-icons/io5";
import { RiAiGenerate2 } from "react-icons/ri";
import { RiAiGenerateText } from "react-icons/ri";
import { RiApps2AiFill } from "react-icons/ri";
import { SiNotion } from "react-icons/si";

export default function Home() {
  return (
    <div>
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between py-6 px-20">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center">
              <img src="/logo200.png" alt="Logo" className="w-10 h-10 object-cover rounded-lg" />
            </div>
            <div className="text-xl font-bold text-gray-900">
              Word<span className="text-red-600">ix</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
              Home
            </Link>
            <Link
              href="#about"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              About
            </Link>
            <Link
              href="#products"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              Products
            </Link>
            <Link href="#faqs" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
              FAQs
            </Link>
            <div className="flex items-center space-x-4">
              <Link href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/login`}>
                <Button
                  variant="outline"
                  className="text-gray-900 hover:text-gray-700 transition-all duration-300 hover:scale-105"
                >
                  Sign in
                </Button>
              </Link>
              <Link href={process.env.NEXT_PUBLIC_APP_DOMAIN}>
                <Button
                  variant="default"
                  className="bg-gray-900 hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                >
                  Try for free
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </div>

      <div className="h-[88px]" />

      <div className="min-h-screen w-full px-20 mb-12">
        <main className="container mx-auto px-4 mt-12 grid grid-cols-2 gap-8 pb-28">
          <div className="flex flex-col justify-center space-y-8">
            <h1 className="font-['Fascinate_Inline'] text-7xl leading-tight text-black">Discover the Power of</h1>

            <p className="font-mono text-lg text-gray-600 max-w-xl">
              Wordix is a revolutionary platform that harnesses the power of natural language processing and AI to
              streamline document flow and enable the rapid development of custom
            </p>

            <div className="flex items-center space-x-6">
              <Link href={process.env.NEXT_PUBLIC_APP_DOMAIN}>
                <Button className="px-8 py-3 bg-black text-gray-400 font-mono font-semibold rounded-full transition-all duration-300 hover:scale-105">
                  Explore Now
                </Button>
              </Link>
              <Link href={process.env.NEXT_PUBLIC_APP_DOMAIN}>
                <Button
                  variant="ghost"
                  className="font-mono text-base text-gray-800 transition-all duration-300 hover:scale-105"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative h-[455px]">
            <div className="flex gap-4 w-full flex-row mb-[30px]">
              <div className="flex space-x-4 flex-col">
                <img
                  src="//cdn-imgs.dora.run/design/HHAv8bH2OnQHtLK1MEtrtg.webp/w/4096/h/4096/format/webp?"
                  alt=""
                  className="w-[169px] h-[78px] object-contain mb-[30px]"
                />
                <img
                  src="//cdn-imgs.dora.run/design/DVLtHyRXvZQJOX2Ti2z6Jz.webp/w/4096/h/4096/format/webp?"
                  alt=""
                  className="w-[107px] h-[350px] object-contain"
                />
              </div>
              <div className="flex space-x-4 flex-col">
                <div className="flex flex-col space-y-4 mb-[40px] relative">
                  <img
                    src="//cdn-imgs.dora.run/design/HDWF23xxEFuF0zlbiIvNqB.webp/w/4096/h/4096/format/webp?"
                    alt=""
                    className="w-[112px] h-[185px] object-contain "
                  />
                  <div className="absolute right-[-82px] bottom-[-20px] w-[62px] h-[74px] bg-black" />
                </div>

                <img
                  src="//cdn-imgs.dora.run/design/J1h7YNbnPPRIWS16dcWx3s.webp/w/4096/h/4096/format/webp?"
                  alt=""
                  className="w-[155px] h-[204px] object-cover"
                />
              </div>
            </div>

            <div className="ml-[100px]">
              <img
                src="//cdn-imgs.dora.run/design/KNqiSDvNVwdILaz3ymrdPC.webp/w/4096/h/4096/format/webp?"
                alt="Icon"
                className="w-[133px] h-[60px] object-contain"
              />
            </div>
          </div>
        </main>
        <div id="about" className="relative w-full h-screen flex flex-col items-center justify-center py-28 mt-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 font-['Fascinate_Inline']">About Wordix</h1>
            <p className="text-lg text-gray-500 mt-2">
              Wordix is ​​a platform that combines natural language processing and artificial intelligence to run document
              streams to obtain results
            </p>
          </div>
          <div className=" grid grid-cols-3 gap-x-8 gap-y-16 w-full">
            <div className="bg-white rounded-sm border p-6 border-[#717172]">
              <div className="flex items-start mb-8">
                <div className="w-16 h-16 mr-4 flex items-center justify-center rounded-full bg-gray-100">
                  <IoDocument className="w-8 h-8" style={{ width: "32px", height: "32px" }} />
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800">Document workflow</h3>
                  <p className="text-sm text-gray-500">Run in document form</p>
                </div>
              </div>
              <div className="flex items-start mb-8">
                <div className="w-16 h-16 mr-4 flex items-center justify-center rounded-full bg-gray-100">
                  <SiNotion className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Notion-like interface</h3>
                  <p className="text-sm text-gray-500">The interaction is simple, similar to notion </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-16 h-16 mr-4 flex items-center justify-center rounded-full bg-gray-100">
                  <IoLanguageSharp className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">natural language program</h3>
                  <p className="text-sm text-gray-500">No additional study required</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-sm border p-6 border-[#717172]">
              <div className="flex items-start mb-8">
                <div className="w-16 h-16 mr-4 flex items-center justify-center rounded-full bg-gray-100">
                  <FaRunning className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">AI Run</h3>
                  <p className="text-sm text-gray-500">Run AI document flow</p>
                </div>
              </div>
              <div className="flex items-start mb-8">
                <div className="w-16 h-16 mr-4 flex items-center justify-center rounded-full bg-gray-100">
                  <RiAiGenerate2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">AI generated prompt</h3>
                  <p className="text-sm text-gray-500">AI generated document prompt</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-16 h-16 mr-4 flex items-center justify-center rounded-full bg-gray-100">
                  <RiAiGenerateText className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-800">AI editing documents</h3>
                  <p className="text-sm text-gray-500">AI edits documents to improve document writing efficiency</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-sm border p-6 border-[#717172]">
              <div className="flex items-start mb-8">
                <div className="w-16 h-16 mr-4 flex items-center justify-center rounded-full bg-gray-100">
                  <RiApps2AiFill className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-800">AI app</h3>
                  <p className="text-sm text-gray-500">Support the deployment of your own AI app</p>
                </div>
              </div>
              <div className="flex items-start mb-8">
                <div className="w-16 h-16 mr-4 flex items-center justify-center rounded-full bg-gray-100">
                  <AiFillApi className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-800">api support</h3>
                  <p className="text-sm text-gray-500">Call the API and integrate it into your app</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="products" className="relative w-full h-full flex flex-col items-center py-28">
          {/* Section Header */}
          <div className="text-center mt-16">
            <h1 className="font-fascinate text-5xl text-gray-900 font-['Fascinate_Inline']">Why Choose Wordix?</h1>
            <p className="mt-4 text-lg text-gray-500">Quickly build your own AI App</p>
          </div>
          {/* Media and Content */}
          <div className="flex justify-center space-x-4 mt-12 w-full max-w-7xl">
            {/* Left Image */}
            <div className="flex-1">
              <img
                src="//cdn-imgs.dora.run/design/JbNUP6lpj4rHeMQwbb6eoV.webp/w/4096/h/4096/format/webp?"
                alt="Left"
                className="object-cover w-full h-full"
              />
            </div>
            {/* Middle Content */}
            <div className="flex-1 bg-gray-50 rounded-lg shadow flex flex-col items-center justify-center p-4">
              <div className="w-4/5 h-auto">
                <img
                  src="//cdn-imgs.dora.run/design/K3lhBua7TvBJPFkvEgIAPI.webp/w/4096/h/4096/format/webp?"
                  alt="Middle"
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="w-full bg-gray-50 rounded-lg border border-gray-400 mt-4 p-2 flex justify-between">
                <span className="text-sm text-gray-600">Innovative</span>
                <span className="text-sm text-gray-400">Tailored</span>
              </div>
            </div>
            {/* Right Image */}
            <div className="flex-1">
              <img
                src="//cdn-imgs.dora.run/design/2Xo9E7Ssa8I40Zifje0mk.webp/w/4096/h/4096/format/webp?"
                alt="Right"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          {/* Media and Content */}
          <div className="flex justify-center space-x-4 mt-12 w-full max-w-7xl">
            {/* Left Image */}
            <div className="flex-1">
              <img
                src="//cdn-imgs.dora.run/design/JEXBNZTTB3iGR4np72B9Yp.webp/w/4096/h/4096/format/webp?"
                alt="Left"
                className="object-cover w-full h-full"
              />
            </div>
            {/* Middle Content */}
            <div className="flex-1 bg-gray-50 rounded-lg shadow flex flex-col items-center justify-center p-4">
              <div className="w-4/5 h-auto">
                <img
                  src="//cdn-imgs.dora.run/design/Br9U8O9BllgFlmbE7lxHRn.webp/w/4096/h/4096/format/webp?"
                  alt="Middle"
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="w-full bg-gray-50 rounded-lg border border-gray-400 mt-4 p-2 flex justify-between">
                <span className="text-sm text-gray-600">Innovative</span>
                <span className="text-sm text-gray-400">Tailored</span>
              </div>
            </div>
            {/* Right Image */}
            <div className="flex-1" />
          </div>
        </div>

        <div className="relative w-full h-screen flex flex-col items-center justify-center bg-white mt-12">
          <div className="relative text-center mb-8">
            <h1 className="text-5xl font-semibold font-fascinate text-black font-['Fascinate_Inline']">
              Transforming Businesses
            </h1>
            <p className="text-lg font-source-serif-pro text-gray-800 mt-4">
              Wordix is the game-changing platform that businesses trust to streamline their document-centric workflows
            </p>
          </div>
          <div className="relative w-4/5 max-w-screen-lg">
            <img
              src="//cdn-imgs.dora.run/design/EAl8v8BrUGNFfmkuCAHA9v.webp/w/4096/h/4096/format/webp?"
              className="w-full h-auto object-contain"
              alt="Display"
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full h-full pt-28">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-6 font-['Fascinate_Inline']">Ligula ma.</h1>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Nec turpis feugiat aenean vehicula tincidunt id duis ante eu, cursus hac orci viverra nisl diam iaculis
              vitae laoreet, sociosqu semper mus al.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 mx-4">
          <div className="relative bg-white border border-gray-900 rounded-md shadow-lg p-6">
            <div className="flex items-center mb-4">
              <img
                src="https://cdn-imgs.dora.run/design/E0hWh2twDtGHJG9igcj9qX.webp/w/4096/h/4096/format/webp?"
                alt="icon"
                className="w-12 h-12"
              />
            </div>
            <div>
              <h2 className="font-fascinate text-2xl text-gray-800">Seamless</h2>
              <h3 className="mt-2 font-source-code-pro text-gray-700">Unparalleled Accuracy</h3>
              <p className="mt-4 font-source-code-pro text-gray-700 text-sm">
                Wordix seamlessly integrates with your existing systems, allowing you to execute document-centric
                workflows with...
              </p>
            </div>
            <Button className="mt-6 w-full py-2 bg-black text-white font-semibold rounded-full transition-all duration-300 hover:scale-105">
              Explore Integration
            </Button>
          </div>

          <div className="relative bg-black border border-gray-900 rounded-md shadow-lg p-6">
            <div>
              <h2 className="font-fascinate text-2xl text-white">Unlock New Possibilities</h2>
              <h3 className="mt-2 font-source-code-pro text-gray-400">Trusted by Leaders</h3>
              <p className="mt-4 font-source-code-pro text-gray-400 text-sm">
                Wordix is the premier platform that empowers businesses to revolutionize their document-centric
                workflows...
              </p>
            </div>
            <Link href={process.env.NEXT_PUBLIC_APP_DOMAIN}>
              <Button className="mt-6 w-full py-2 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105">
                Get Started
              </Button>
            </Link>
          </div>

          <div className="relative bg-white border border-gray-900 rounded-md shadow-lg p-6">
            <div className="flex items-center mb-4">
              <img
                src="https://cdn-imgs.dora.run/design/DMpBFBAoj1gKhIZVNa4L31.webp/w/4096/h/4096/format/webp?"
                alt="icon"
                className="w-12 h-12"
              />
            </div>
            <div>
              <h2 className="font-fascinate text-2xl text-gray-800">Empowering</h2>
              <h3 className="mt-2 font-source-code-pro text-gray-700">Trusted by Businesses</h3>
              <p className="mt-4 font-source-code-pro text-gray-700 text-sm">
                Wordix is the game-changing platform that businesses trust to streamline their document-centric
                workflows...
              </p>
            </div>
            <Button className="mt-6 w-full py-2 bg-black text-white font-semibold rounded-full transition-all duration-300 hover:scale-105">
              Learn More
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full h-full">
          {/* Main Container */}
          <div className="flex flex-col items-center mt-10 w-full max-w-screen-lg">
            {/* Text Content */}
            <div className="flex justify-center items-start mb-8">
              <p className="text-center text-gray-700 font-source-code-pro text-base leading-relaxed max-w-xl">
                Wordix is ​​an AI app that uses natural language workflow and the power of generation to create your own
                AI technology website.
              </p>
            </div>

            {/* Button */}
            <Link href={process.env.NEXT_PUBLIC_APP_DOMAIN}>
              <Button className="px-8 py-3 bg-gray-800 text-white font-semibold text-sm rounded-full shadow-lg hover:bg-gray-700 transition-all duration-300 hover:scale-105">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center bg-black text-white p-8">
        <div className="flex items-center space-x-8">
          <div className="w-16 h-16">
            <img src="/logo-white-256.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <p className="text-gray-400 font-source-code-pro text-sm text-center">
            © 2024 Wordix, Inc.
            <br />
            All rights reserved.
          </p>
        </div>
        <div className="flex space-x-4">
          <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors duration-200">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">
            Terms
          </Link>
        </div>
      </div>
    </div>
  );
}
