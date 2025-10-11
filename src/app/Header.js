// "use client"

// import React, { useState } from 'react'
// import {
//   Home,
//   Search,
//   Bell,
//   User,
//   Menu,
//   X,
//   MapPin,
//   Stethoscope,
//   Code,
//   Briefcase,
//   Palette,
//   GraduationCap,
//   Wrench,
//   Camera,
//   Music,
//   Calculator,
//   Scissors,
//   Car,
//   ChefHat,
//   Heart,
// } from 'lucide-react'

// // Mock NavLinks component since it's not available
// const NavLinks = () => (
//   <button className="px-4 py-2 bg-blue-600 text-white rounded-lg
//                hover:bg-blue-700 active:bg-blue-800
//                transition-colors duration-300">
//     Sign In
//   </button>
// )

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false)
//   const [selectedProfession, setSelectedProfession] = useState(null)
//   const [showProfessions, setShowProfessions] = useState(false)

//   const professions = [
//     { icon: Stethoscope, name: "Healthcare", color: "text-red-500" },
//     { icon: Code, name: "Tech", color: "text-blue-500" },
//     { icon: Briefcase, name: "Business", color: "text-gray-600" },
//     { icon: Palette, name: "Creative", color: "text-purple-500" },
//     { icon: GraduationCap, name: "Education", color: "text-green-500" },
//     { icon: Wrench, name: "Engineering", color: "text-orange-500" },
//     { icon: Camera, name: "Media", color: "text-indigo-500" },
//     { icon: Music, name: "Arts", color: "text-pink-500" },
//     { icon: Calculator, name: "Finance", color: "text-emerald-500" },
//     { icon: Scissors, name: "Beauty", color: "text-rose-500" },
//     { icon: Car, name: "Transport", color: "text-slate-600" },
//     { icon: ChefHat, name: "Culinary", color: "text-amber-500" }
//   ]

//   const navItems = [
//     { name: "Browse Homes", icon: Search, href: "#" },
//     { name: "Favorites", icon: Heart, href: "#" },
//     { name: "My Profile", icon: User, href: "#" }
//   ]

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="fixed top-0 left-0 right-0 z-[9999] w-full bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg">
//         <div className="max-w-7xl mx-auto px-4 md:px-8">
//           <div className="flex justify-between items-center py-4">
//             {/* Logo Section */}
//             <div className="flex items-center space-x-3">
//               <div className="relative group">
//                 <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
//                   <Home className="w-6 h-6 text-green-700 font-bold" />
//                 </div>
//                 <div className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" style={{ background: "linear-gradient(135deg, #ff4500, #0080ff)" }} />
//               </div>
//               <div>
//                 <h2 className="text-xl md:text-2xl font-bold bg-green-600 bg-clip-text text-transparent">
//                   Nyumba App
//                 </h2>
//               </div>
//             </div>

//             {/* Center Navigation - Desktop */}
//             <nav className="hidden lg:flex items-center space-x-8">
//               {navItems.map((item) => {
//                 const IconComponent = item.icon
//                 return (
//                   <a
//                     key={item.name}
//                     href={item.href}
//                     className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-300 group"
//                   >
//                     <IconComponent className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
//                     <span className="font-medium">{item.name}</span>
//                   </a>
//                 )
//               })}

//               {/* Profession Selector */}
//               <div className="relative">
//                 <button
//                   onClick={() => setShowProfessions(!showProfessions)}
//                   className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-300 group"
//                 >
//                   {selectedProfession ? (
//                     <>
//                       <selectedProfession.icon className={`w-5 h-5 ${selectedProfession.color}`} />
//                       <span className="font-medium">{selectedProfession.name}</span>
//                     </>
//                   ) : (
//                     <>
//                       <Briefcase className="w-5 h-5" />
//                       <span className="font-medium">Professions</span>
//                     </>
//                   )}
//                 </button>

//                 {showProfessions && (
//                   <div className="absolute top-full right-0 mt-2 w-64 bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-xl p-4 grid grid-cols-3 gap-2">
//                     {professions.map((profession) => {
//                       const IconComponent = profession.icon
//                       return (
//                         <button
//                           key={profession.name}
//                           onClick={() => {
//                             setSelectedProfession(profession)
//                             setShowProfessions(false)
//                           }}
//                           className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-50 transition-colors duration-300 group"
//                         >
//                           <IconComponent className={`w-6 h-6 ${profession.color} group-hover:scale-110 transition-transform duration-300`} />
//                           <span className="text-xs font-medium text-gray-700 mt-1">{profession.name}</span>
//                         </button>
//                       )
//                     })}
//                   </div>
//                 )}
//               </div>
//             </nav>

//             {/* Right Section */}
//             <div className="flex items-center space-x-4">
//               <div className="hidden md:flex items-center space-x-2 text-gray-600 bg-gray-100/80 px-3 py-2 rounded-full">
//                 <MapPin className="w-4 h-4" />
//                 <span className="text-sm font-medium">Mzuzu</span>
//               </div>

//               <button className="relative p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-300">
//                 <Bell className="w-5 h-5" />
//                 <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
//                   <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
//                 </span>
//               </button>

//               {/* Desktop NavLinks */}
//               <div className="hidden md:block">
//                 <NavLinks />
//               </div>

//               <button
//                 onClick={() => setIsMenuOpen(!isMenuOpen)}
//                 className="md:hidden p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-300"
//               >
//                 {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//               </button>
//             </div>
//           </div>

//           {/* Mobile Menu */}
//           {isMenuOpen && (
//             <div className="md:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-md">
//               <div className="py-4 space-y-4">
//                 {navItems.map((item) => {
//                   const IconComponent = item.icon
//                   return (
//                     <a
//                       key={item.name}
//                       href={item.href}
//                       className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all duration-300"
//                     >
//                       <IconComponent className="w-5 h-5" />
//                       <span className="font-medium">{item.name}</span>
//                     </a>
//                   )
//                 })}

//                 <div className="px-4">
//                   <h3 className="text-sm font-semibold text-gray-500 mb-3">Browse by Profession</h3>
//                   <div className="grid grid-cols-4 gap-3">
//                     {professions.slice(0, 8).map((profession) => {
//                       const IconComponent = profession.icon
//                       return (
//                         <button
//                           key={profession.name}
//                           className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-50 transition-colors duration-300"
//                         >
//                           <IconComponent className={`w-5 h-5 ${profession.color}`} />
//                           <span className="text-xs font-medium text-gray-700 mt-1">{profession.name}</span>
//                         </button>
//                       )
//                     })}
//                   </div>
//                 </div>

//                 <div className="px-4 py-3 border-t border-gray-200/50">
//                   <div className="flex items-center space-x-2 text-gray-600">
//                     <MapPin className="w-4 h-4" />
//                     <span className="text-sm font-medium">Current Location: Blantyre</span>
//                   </div>
//                 </div>

//                 <div className="px-4 pt-2 border-t border-gray-200/50">
//                   <NavLinks />
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {showProfessions && (
//           <div
//             className="fixed inset-0 z-[-1]"
//             onClick={() => setShowProfessions(false)}
//           />
//         )}
//       </header>

//       {/* Demo Content */}
//       <div className="pt-20 p-8">
//         <div className="max-w-4xl mx-auto">
//           <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
//             <h3 className="text-2xl font-bold text-gray-900 mb-4">Header Preview</h3>
//             <p className="text-gray-600 mb-4">
//               Hover over the home icon in the logo to see the orange-to-blue gradient effect!
//             </p>
//             <div className="text-sm text-gray-500">
//               • The gradient appears on hover with 20% opacity
//               • Direction: 135 degrees (diagonal)
//               • Colors: Orange Red (#ff4500) → Blue (#0080ff)
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl p-8 shadow-lg">
//             <h4 className="text-lg font-semibold text-gray-900 mb-4">Interactive Features</h4>
//             <ul className="space-y-2 text-gray-600">
//               <li>• Try clicking the "Professions" dropdown</li>
//               <li>• Test the mobile menu (hamburger button)</li>
//               <li>• Hover over navigation items for animations</li>
//               <li>• Notice the glassmorphism backdrop effects</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Header


"use client"

import React, { useState } from 'react'
import {
  Home,
  Search,
  Bell,
  User,
  Menu,
  X,
  MapPin,
  Stethoscope,
  Code,
  Briefcase,
  Palette,
  GraduationCap,
  Wrench,
  Camera,
  Music,
  Calculator,
  Scissors,
  Car,
  ChefHat,
  Heart,
} from 'lucide-react'

// Mock NavLinks component since it's not available
const NavLinks = () => (
  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg
               hover:bg-blue-700 active:bg-blue-800
               transition-colors duration-300">
    Sign In
  </button>
)

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedProfession, setSelectedProfession] = useState(null)
  const [showProfessions, setShowProfessions] = useState(false)

  const professions = [
    { icon: Stethoscope, name: "Healthcare", color: "text-red-500" },
    { icon: Code, name: "Tech", color: "text-blue-500" },
    { icon: Briefcase, name: "Business", color: "text-gray-600" },
    { icon: Palette, name: "Creative", color: "text-purple-500" },
    { icon: GraduationCap, name: "Education", color: "text-green-500" },
    { icon: Wrench, name: "Engineering", color: "text-orange-500" },
    { icon: Camera, name: "Media", color: "text-indigo-500" },
    { icon: Music, name: "Arts", color: "text-pink-500" },
    { icon: Calculator, name: "Finance", color: "text-emerald-500" },
    { icon: Scissors, name: "Beauty", color: "text-rose-500" },
    { icon: Car, name: "Transport", color: "text-slate-600" },
    { icon: ChefHat, name: "Culinary", color: "text-amber-500" }
  ]

  const navItems = [
    { name: "Browse Homes", icon: Search, href: "#" },
    { name: "Favorites", icon: Heart, href: "#" },
    { name: "My Profile", icon: User, href: "#" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 right-0 z-[9999] w-full bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Home className="w-6 h-6 text-green-700 font-bold" />
                </div>
                <div className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" style={{ background: "linear-gradient(135deg, #ff4500, #0080ff)" }} />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold bg-green-600 bg-clip-text text-transparent">
                  Nyumba App
                </h2>
              </div>
            </div>

            {/* Center Navigation - Desktop */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-300 group"
                  >
                    <IconComponent className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium">{item.name}</span>
                  </a>
                )
              })}

              {/* Profession Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowProfessions(!showProfessions)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-300 group"
                >
                  {selectedProfession ? (
                    <>
                      <selectedProfession.icon className={`w-5 h-5 ${selectedProfession.color}`} />
                      <span className="font-medium">{selectedProfession.name}</span>
                    </>
                  ) : (
                    <>
                      <Briefcase className="w-5 h-5" />
                      <span className="font-medium">Professions</span>
                    </>
                  )}
                </button>

                {showProfessions && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-xl p-4 grid grid-cols-3 gap-2">
                    {professions.map((profession) => {
                      const IconComponent = profession.icon
                      return (
                        <button
                          key={profession.name}
                          onClick={() => {
                            setSelectedProfession(profession)
                            setShowProfessions(false)
                          }}
                          className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-50 transition-colors duration-300 group"
                        >
                          <IconComponent className={`w-6 h-6 ${profession.color} group-hover:scale-110 transition-transform duration-300`} />
                          <span className="text-xs font-medium text-gray-700 mt-1">{profession.name}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-gray-600 bg-gray-100/80 px-3 py-2 rounded-full">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Mzuzu</span>
              </div>

              <button className="relative p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-300">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                </span>
              </button>

              {/* Desktop NavLinks */}
              <div className="hidden md:block">
                <NavLinks />
              </div>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-300"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-md">
              <div className="py-4 space-y-4">
                {navItems.map((item) => {
                  const IconComponent = item.icon
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all duration-300"
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </a>
                  )
                })}

                <div className="px-4">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">Browse by Profession</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {professions.slice(0, 8).map((profession) => {
                      const IconComponent = profession.icon
                      return (
                        <button
                          key={profession.name}
                          className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                        >
                          <IconComponent className={`w-5 h-5 ${profession.color}`} />
                          <span className="text-xs font-medium text-gray-700 mt-1">{profession.name}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-gray-200/50">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">Current Location: Blantyre</span>
                  </div>
                </div>

                <div className="px-4 pt-2 border-t border-gray-200/50">
                  <NavLinks />
                </div>
              </div>
            </div>
          )}
        </div>

        {showProfessions && (
          <div
            className="fixed inset-0 z-[-1]"
            onClick={() => setShowProfessions(false)}
          />
        )}
      </header>

      {/* Demo Content */}
      <div className="pt-20 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Header Preview</h3>
            <p className="text-gray-600 mb-4">
              Hover over the home icon in the logo to see the orange-to-blue gradient effect!
            </p>
            <div className="text-sm text-gray-500">
              • The gradient appears on hover with 20% opacity
              • Direction: 135 degrees (diagonal)
              • Colors: Orange Red (#ff4500) → Blue (#0080ff)
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Interactive Features</h4>
            <ul className="space-y-2 text-gray-600">
              <li>• Try clicking the "Professions" dropdown</li>
              <li>• Test the mobile menu (hamburger button)</li>
              <li>• Hover over navigation items for animations</li>
              <li>• Notice the glassmorphism backdrop effects</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
