import './Home.page.css'
import { useCallback } from 'react'
import { loadFull } from "tsparticles";
import Particles from 'react-particles'

const particlesOptions = {
    "particles": {
      "number": {
        "value": 80,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 0.1,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 40,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 1,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "grab"
        },
        "onclick": {
          "enable": false,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 100,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 200,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  }



export const HomePage = () => {

    const particlesInit = useCallback(async (engine) => {
        console.log(engine);
        await loadFull(engine);
      }, []);
    
      const particlesLoaded = useCallback(async (container) => {
        await console.log(container);
      }, []);


    return <div className='home-page-container'>
        <Particles  
            init={particlesInit}
            loaded={particlesLoaded}
            className='home-page-particles' options={particlesOptions}></Particles>
<svg className='logo-svg' width="60%" height="60%" version="1.1" viewBox="0 0 132.29 132.29" xmlns="http://www.w3.org/2000/svg">
 <path className="logo-connector" d="m35.876 78.891v17.313l-17.135 12.494" />
 <path className="logo-connector" d="m76.542 78.83v17.313l12.494 15.528" />
 <path className="logo-connector" d="m96.567 78.712-0.17849 12.137 11.423 6.4255" />
 <path className="logo-connector" d="m50.483 78.651v17.313l1e-6 19.633" />
 <path className="logo-connector" d="m63.362 79.872v17.313" />
 <path className="logo-connector" d="m36.988 33.538v17.313l6.604 3e-6" />
 <path className="logo-connector" d="m79.694 23.114v17.313l-11.245 0.17849" />
 <path className="logo-connector" d="m97.728 38.546v24.274l-32.484-0.17848" />
 <path className="logo-connector" d="m12.786 63.51-5.5328 0.077685-0.083921-23.025" />
 <path className="logo-connector" d="m116.33 62.961 7.5838-0.1008 0.081-23.025" />
 <path className="logo-cloud" d="m66.486 19.098c-10.406 0.0033-19.729 5.678-23.429 14.262-1.236-0.34378-2.5102-0.51804-3.7899-0.51831-8.0831 9e-6 -14.636 6.7924-14.636 15.171 0.0012 0.03962 0.0026 0.07924 0.0041 0.11886-7.0381 2.1517-11.779 8.1361-11.784 14.874 1.19e-4 8.6745 7.7515 15.707 17.313 15.707 0.2734-0.0034 0.54667-0.01274 0.81959-0.02791 0.06639 0.01659 0.13503 0.02791 0.20671 0.02791h65.377c0.82518 0.11829-0.83417-7.48e-4 0 0 9.4632-1.19e-4 19.627-7.2532 19.627-16.421-2.5e-4 -7.5951-5.3218-14.221-12.921-16.089-1.8691-6.0526-6.8252-10.505-12.837-11.531-3.256-9.2609-12.963-15.573-23.95-15.573z" />
 <ellipse className="logo-connector" cx="7.0502" cy="36.06" rx="4.5514" ry="4.4621" />
 <ellipse className="logo-connector" cx="48.37" cy="50.868" rx="4.5514" ry="4.4621" />
 <ellipse className="logo-connector" cx="63.898" cy="40.695" rx="4.5514" ry="4.4621" />
 <ellipse className="logo-connector" cx="60.507" cy="62.47" rx="4.5514" ry="4.4621" />
 <ellipse className="logo-connector" cx="15.171" cy="111.2" rx="4.5514" ry="4.4621" />
 <ellipse className="logo-connector" cx="50.333" cy="120.12" rx="4.5514" ry="4.4621" />
 <ellipse className="logo-connector" cx="63.362" cy="101.74" rx="4.5514" ry="4.4621" />
 <ellipse className="logo-connector" cx="92.099" cy="115.3" rx="4.5514" ry="4.4621" />
 <ellipse className="logo-connector" cx="111.73" cy="99.952" rx="4.5514" ry="4.4621" />
 <ellipse className="logo-connector" cx="124.05" cy="35.34" rx="4.5514" ry="4.4621" />
 <text className="logo-text" x="65" y="75" space="preserve"><tspan>e-flows</tspan></text>
</svg>

    </div>
}