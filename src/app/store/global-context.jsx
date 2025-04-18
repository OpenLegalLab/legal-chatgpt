"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  chatPanelOption,
  ChatPanelOptions,
  PineconeIndexes,
  PineconeNamespaces,
} from "../(private)/chat/enum/enums";

// Create a context
const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [relevantDocs, setRelevantDocs] = useState([]);
  const [documentQuery, setDocumentQuery] = useState("");
  const [namespace, setNamespace] = useState(PineconeNamespaces.canadian_law);
  const [userQuery, setUserQuery] = useState("");
  const [generateFlag, setGenerateFlag] = useState(true);
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const generateFlagRef = useRef(generateFlag);
  const [conversationTitles, setConversationTitles] = useState([]);
  const [alert, setAlert] = useState("");
  const [infoAlert, setInfoAlert] = useState("");
  const [indexName, setIndexName] = useState(PineconeIndexes.staticDocuments);
  const [documents, setDocuments] = useState([]);
  const [showStartupImage, setShowStartupImage] = useState(true);
  const [includedDocuments, setIncludedDocuments] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [conversationId, setConversationId] = useState("");
  const [latestResponse, setLatestResponse] = useState("");
  const [documentContent, setDocumentContent] = useState("");
  const [num, setNum] = useState(-1);
  const [chatPanelOption, setChatPanelOption] = useState(null);
  const [user, setUser] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const userScrolling = useRef(false);
  const scrollIntoViewRef = useRef(null);

  // handle delete documents from UploadedDocuments
  const deleteDocumentChat = (uid) => {
    deleteDocument(uid)
      .then(() => setDocuments(documents.filter((doc) => doc.uid !== uid)))
      .catch((err) => {
        console.log("Error when deleting PDF, " + err);
      });
  };

  /**
   * Confirms with the user if they want to exit the tab
   *
   * @param event the close tab event
   */
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue =
      "Are you sure you want to leave? The response will not be stored to your current chat's history if you exit right now.";
  };

  // Sets the appropriate local storage settings when toggling between elastic and keyword search
  const restoreUserPreferences = () => {
    const namespacePref = localStorage.getItem("namespace");
    if (!namespacePref) return;
    setNamespace(JSON.parse(namespacePref));
  };

  /**
   * Stops generating the normal LLM buffered output
   *
   * @param event
   * @returns
   */
  const stopQuery = (event) => {
    event.preventDefault();
    generateFlagRef.current = false;
    setLoading(false);
    setPdfLoading(false);
  };

  useEffect(() => {
    restoreUserPreferences();
  }, []);

  if (GlobalContext === null) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider"
    );
  }
  return (
    <GlobalContext.Provider
      value={{
        relevantDocs,
        setRelevantDocs,
        documentQuery,
        setDocumentQuery,
        namespace,
        setNamespace,
        userQuery,
        setUserQuery,
        generateFlag,
        setGenerateFlag,
        generateFlagRef,
        loadingPDF,
        setLoadingPDF,
        alert,
        setAlert,
        loading,
        setLoading,
        pdfLoading,
        setPdfLoading,
        conversationTitles,
        setConversationTitles,
        conversationId,
        setConversationId,
        infoAlert,
        setInfoAlert,
        indexName,
        setIndexName,
        documents,
        setDocuments,
        showStartupImage,
        setShowStartupImage,
        includedDocuments,
        setIncludedDocuments,
        conversation,
        setConversation,
        latestResponse,
        setLatestResponse,
        userQuery,
        setUserQuery,
        documentContent,
        setDocumentContent,
        num,
        setNum,
        deleteDocumentChat,
        handleBeforeUnload,
        stopQuery,
        scrollIntoViewRef,
        chatPanelOption,
        setChatPanelOption,
        setUser,
        user,
        isNavOpen,
        setIsNavOpen,
        userScrolling,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
