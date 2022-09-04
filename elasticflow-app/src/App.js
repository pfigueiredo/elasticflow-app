import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { FlowsPage } from './components/Flows.page'
import { HomePage } from './components/Home.page'
import { FlowPage } from './components/Flow.page'
import { DesignerPage } from './components/Designer.page'
import { ConsolePage } from './components/Console.page'
import { Navbar, Button, Alignment } from '@blueprintjs/core'

import './App.css'

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={ queryClient }>
      <Router>
        <div>
          <Navbar>
            <Navbar.Group align={Alignment.LEFT}>
                <Link to="/"><Navbar.Heading>e-Flows</Navbar.Heading></Link>
                <Navbar.Divider />
                <Link to="/"><Button className="bp4-minimal" icon="home" text="Home" /></Link>
                <Link to="/flows"><Button className="bp4-minimal" icon="document" text="Flows" to="/flows" /></Link>
            </Navbar.Group>
          </Navbar>
          <Routes>
            <Route path='/' element={<HomePage />}>
            </Route>
            <Route path='/flow/:id' element={<FlowPage/>}>
            </Route>
            <Route path='/flows' element={<FlowsPage />}>
            </Route>
            <Route path='/designer/:id' element={<DesignerPage/>}>
            </Route>
            <Route path='/console/:id' element={<ConsolePage/>}>
            </Route>
          </Routes>
        </div>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} position='bottom-right'/>
    </QueryClientProvider>
  );
}

export default App;
