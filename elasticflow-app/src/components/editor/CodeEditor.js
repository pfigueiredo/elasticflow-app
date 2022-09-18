import React, { useState, useRef } from 'react';
import Editor from "@monaco-editor/react";
import eslint from 'eslint-linter-browserify'
import { esLintConfig } from './Utils/linterConfig'
import lib1 from './Utils/msgLib.d.ts.js';
import { emitCustomEvent, useCustomEventListener } from 'react-custom-events'
import { Drawer, DrawerSize, Position } from '@blueprintjs/core';


function CodeEditor(props) {

  const [show, setShow] = useState(false);
  const [codeObject, setCodeObject] = useState({ code: "", path: "empty.js" });
  const [object, setObject] = useState(null);
  const [objectType, setObjectType] = useState("none");

  useCustomEventListener('editor:editActivityCode', data => {
      setCodeObject(
        { 
          code: data.activity.properties?.functionCode ?? "",
          path: "activity_" + data.activity.address + '.js'
        }
      );
      setObject(data.activity);
      setObjectType("activity");
      setShow(true);
      data.activity.hasErrors = false;
      data.activity.hasWarnings = false;
  });

  function saveChanges() {
    if (objectType === "activity") {
      if (!object.properties) object.properties = {};
      object.properties.functionCode = monacoRef.current.getValue();
      emitCustomEvent('editor:activityCodeChanged', {
        address: object.address,
        activity: object
      });
    }
    setShow(false);
  }


  // function cancelChanges() {
  //   setShow(false);
  // }

  const monacoRef = useRef(null);
  const monacoRootRef = useRef(null);

  function handleEditorWillMount(monaco) {
      // here is the monaco instance
      // do something before editor is mounted

      monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);

      let libUri = 'ts:filename/msgLib.d.ts';
      let libSource = lib1;
      monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, monaco.Uri.parse(libUri));

      let model = monaco.editor.getModel(monaco.Uri.parse(libUri));
      if (!model) {
        console.log("model is null, creating new one");
        model = monaco.editor.createModel(libSource, 'typescript', monaco.Uri.parse(libUri));
      } else
        console.log("model already exists");

  }

  function handleEditorDidChangeContext() {
    const value = monacoRef.current.getValue();
    lintCode(value);
  }

  function handleEditorDidMount(editor, monaco) {
      monacoRef.current = editor; 
      monacoRootRef.current = monaco;
      const value = monacoRef.current.getValue();
      lintCode(value);
  }

  function handleEditorValidation(markers) {
    const activity = object;

      // model markers
      markers.forEach(
        marker => {
          activity.hasErrors |= marker.severity > 2;
          activity.hasWarnings |= marker.severity === 1;
        }
      );
      
  }

  // const updateMarkers = function (message) {
  //   const editor = monacoRef.current;
  //   window.requestAnimationFrame(() => {
  //     const model = this.editor.getModel();
  //     if (model && model.getVersionId() === message.data.version) {
  //       monaco.editor.setModelMarkers(model, 'eslint', message.data.markers);
  //     }
  //   });
  // };

  //Pass code to eslint linterWorker for processing
  const lintCode = function(code) {

    const editor = monacoRef?.current;
    const monaco = monacoRootRef?.current;
    const activity = object;
    activity.hasErrors = false;
    activity.hasWarnings = false;

    if (!!editor) {
      const model = editor.getModel();
      monaco.editor.setModelMarkers(model, 'eslint', []);      

      const linter = new eslint.Linter();
      const messages = linter.verify(code, esLintConfig).map(err => ({
        startLineNumber: err.line,
        endLineNumber: err.line,
        startColumn: err.column,
        endColumn: err.column,
        message: `${err.message}`,
        severity: (err.fatal) ? 8 : (err.severity || 0),
        source: 'eslint',
        original: err
      })); //config

      // for (let i = 0; i < messages.length; i++) {
      //   console.log(messages[i]);
      // }

      monaco.editor.setModelMarkers(model, 'eslint', messages);

    }
  };

  return (
    <Drawer
            icon="document"
            onClose={saveChanges}
            title={"Code Editor"}
            isOpen={show}
            autoFocus={true}
            canEscapeKeyClose={true}
            hasBackdrop={true}
            position={Position.TOP}
            usePortal={true}
            size={DrawerSize.LARGE}
        >
          <Editor
                height="80vh"
                path={codeObject.path}
                language="javascript"
                value={codeObject.code}
                beforeMount={handleEditorWillMount}
                onMount={handleEditorDidMount}
                onValidate={handleEditorValidation}
                onDidChangeContent={handleEditorDidChangeContext}
                onChange={handleEditorDidChangeContext}
            />
        </Drawer>
  );


  // return (
  //   <>
  //     <Modal show={show} fullscreen={fullscreen} onHide={cancelChanges}>
  //       <Modal.Body className="m-1 p-1">
  //         <div style={{display: "flex", marginBottom: "10px"}}>
  //           <h5>Code Editor</h5>
  //           <Button variant="secondary" className="ms-auto btn-sm" onClick={cancelChanges}>Cancel</Button>
  //           <Button variant="primary" className="ms-2 btn-sm" onClick={saveChanges}>Save</Button>
  //         </div>
            
  //       </Modal.Body>
  //     </Modal>
  //   </>
  // );
}

export default CodeEditor;