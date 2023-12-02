import { Panel, PanelGroup, List, FlexboxGrid, IconButton, Modal, Form, Button } from "rsuite";
import PlusIcon from '@rsuite/icons/Plus';
import VisibleIcon from '@rsuite/icons/Visible';
import UnvisibleIcon from '@rsuite/icons/Unvisible';
import PasswordItem from "../components/PasswordItem";
import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect, useState } from 'react';
import { authStateAtom, cardsAtom, identityAtom, passwordsAtom } from "../recoil/atoms";
import CardItem from "../components/CardItem";
import IdentityItem from "../components/IdentityItem";
import api from '../api';


const noEditProperties = ['username', 'url', 'cardnumber'];
const hideProperties = ['pass', 'cardnumber', 'pin', 'issn', 'ipassport', 'ilicense'];
const numberProperties = ['expirymonth', 'expiryyear', 'izip', 'pin', 'cardnumber'];
const notRequiredProperties = ['notes', 'iaddress2', 'iaddress3', 'imiddlename'];
const internalProperties = ['cardId', 'user', 'category'];

export default function Main() {

  const [passwordsList, setPasswordsList] = useRecoilState(passwordsAtom);
  const [cardsList, setCardsList] = useRecoilState(cardsAtom);
  const [identityList, setIdentityList] = useRecoilState(identityAtom);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalMode, setModalMode] = useState('view'); // view or add
  const [itemType, setItemType] = useState(null);
  const [protectProperties, setProtectProperties] = useState(true);

  const authState = useRecoilValue(authStateAtom);

  useEffect(() => {
    api.get('/user/webpassword').then((res) => { setPasswordsList(res.data.data) });
    api.get('/user/card').then((res) => { setCardsList(res.data.data) });
    api.get('/user/identity').then((res) => { setIdentityList(res.data.data) });
  }, [setPasswordsList, setCardsList, setIdentityList, authState])

  const getPropertyType = (property) => {
    if (internalProperties.includes(property)) {
      return 'hidden';
    } else if (modalMode === 'view' && protectProperties && hideProperties.includes(property)) {
      return 'password';
    } else if (numberProperties.includes(property)) {
      return 'number';
    } else {
      return 'text';
    }
  }

  const toggleProtection = () => {
    setProtectProperties((oldVal) => !oldVal);
  }

  const getPassword = (username, url) => {
    return passwordsList.find(item => item.username === username && item.url === url);
  }

  const getCard = (username, cardnumber) => {
    return cardsList.find(item => item.username === username && item.cardnumber === cardnumber);
  }

  const getIdentity = (username) => {
    return identityList.find(item => item.username === username);
  }

  const createPassword = () => {
    return {
      username: '',
      pass: '',
      url: '',
      notes: ''
    }
  }

  const createCard = () => {
    return {
      username: '',
      cardnumber: '',
      pin: '',
      expirymonth: 0,
      expiryyear: 0,
      notes: '',
      holdername: '',
      cardtype: '',
    }
  }

  const createIdentity = () => {
    return {
      username: '',
      ifirstname: '',
      imiddlename: '',
      ilastname: '',
      iname: '',
      iemail: '',
      iphone: '',
      issn: '',
      ipassport: '',
      ilicense: '',
      iaddress1: '',
      iaddress2: '',
      iaddress3: '',
      icity: '',
      istate: '',
      icountry: '',
      izip: '',
      notes: '',

    }
  }

  const isFormValid = () => {
    let isValid = true;
    Object.getOwnPropertyNames(selectedItem).forEach((property) => {
      if (!notRequiredProperties.includes(property) && selectedItem[property] === '') {
        isValid = false;
      }
    })
    return isValid;
  }

  const handleModalClose = (confirmChanges) => {
    if (confirmChanges) {
      if (isFormValid()) {
        if (modalMode === 'view') {
          switch (itemType) {
            case 'password':
              api.put('/user/webpassword', selectedItem)
                .then(() => {
                  setPasswordsList((currentList) => {
                    return currentList.map(item => {
                      if (item.username === selectedItem.username && item.url === selectedItem.url) {
                        return selectedItem;
                      }
                      return item;
                    })
                  });

                })
                .catch((err) => { console.log(err) });
              break;
            case 'card':
              api.put('/user/card', selectedItem)
                .then(() => {
                  setCardsList((currentList) => {
                    return currentList.map(item => {
                      if (item.username === selectedItem.username && item.cardnumber === selectedItem.cardnumber) {
                        return selectedItem;
                      }
                      return item;
                    })
                  });
                })
                .catch((err) => { console.log(err) });
              break;
            case 'identity':
              api.put('/user/identity', selectedItem)
                .then(() => {
                  setIdentityList((currentList) => {
                    return currentList.map(item => {
                      if (item.username === selectedItem.username) {
                        return selectedItem;
                      }
                      return item;
                    })
                  });
                })
                .catch((err) => { console.log(err) });
              break;
            default: // do nothing
          }
        } else if (modalMode === 'add') {
          switch (itemType) {
            case 'password':
              api.post('/user/webpassword', selectedItem)
                .then(() => { setPasswordsList((currentList) => [...currentList, selectedItem]); })
                .catch((err) => { console.log(err) });
              break;
            case 'card':
              api.post('/user/card', selectedItem)
                .then(() => { setCardsList((currentList) => [...currentList, selectedItem]); })
                .catch((err) => { console.log(err) });
              break;
            case 'identity':
              api.post('/user/identity', selectedItem)
                .then(() => { setIdentityList((currentList) => [...currentList, selectedItem]); })
                .catch((err) => { console.log(err) });
              break;
            default: // do nothing
          }
        }
        setModalOpen(false);
      }
    } else {
      setModalOpen(false);
    }
  }

  const handlePassView = (username, url) => {
    setModalTitle('View Website Password');
    setSelectedItem(getPassword(username, url));
    setItemType('password');
    setModalMode('view');
    setModalOpen(true);
  }

  const addPass = () => {
    setModalTitle('Add Website Password');
    setSelectedItem(createPassword());
    setItemType('password');
    setModalMode('add');
    setModalOpen(true);
  }

  const handleCardView = (username, cardnumber) => {
    setModalTitle('View Card');
    setSelectedItem(getCard(username, cardnumber));
    setItemType('card');
    setModalMode('view');
    setModalOpen(true);
  }

  const addCard = () => {
    setModalTitle('Add Card');
    setSelectedItem(createCard());
    setItemType('card');
    setModalMode('add');
    setModalOpen(true);
  }


  const handleIdentityView = (username) => {
    setModalTitle('View Identity');
    setSelectedItem(getIdentity(username));
    setItemType('identity');
    setModalMode('view');
    setModalOpen(true);
  }

  const addIdentity = () => {
    setModalTitle('Add Identity');
    setSelectedItem(createIdentity());
    setItemType('identity');
    setModalMode('add');
    setModalOpen(true);
  }


  const handlePassRemoval = (username, url) => {
    api.delete(`user/webpassword?username=${username}&url=${url}`)
      .then(() => {
        setPasswordsList((oldList) => {
          return oldList.filter(item => !(item.username === username && item.url === url));
        })
      })
      .catch((err) => { console.log(err) });
  }

  const handleCardRemoval = (username, cardId, holdername) => {
    api.delete(`user/card?username=${username}&cardId=${cardId}&holdername=${holdername}`)
      .then(() => {
        setCardsList((oldList) => {
          return oldList.filter(item => !(item.username === username && item.cardId === cardId && item.holdername === holdername));
        })
      })
      .catch((err) => { console.log(err) });

  }

  const handleIdentityRemoval = (username, iname) => {
    api.delete(`user/identity?username=${username}&iname=${iname}`)
      .then(() => {
        setIdentityList((oldList) => {
          return oldList.filter(item => !(item.username === username && item.iname === iname));
        })
      })
      .catch((err) => { console.log(err) });
  }

  return (
    <>
      <PanelGroup accordion bordered>
        <Panel header="Password Section" defaultExpanded>
          <List bordered>
            {passwordsList.map((pi) => {
              return <List.Item key={`${pi.url}@${pi.username}`}>
                <PasswordItem
                  url={pi.url}
                  username={pi.username}
                  handleRemove={handlePassRemoval}
                  handleView={handlePassView}
                />
              </List.Item>
            })}
            <List.Item>
              <FlexboxGrid justify="center">
                <FlexboxGrid.Item>
                  <IconButton appearance="primary" icon={<PlusIcon />} onClick={addPass}>New Password</IconButton>
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </List.Item>
          </List>
        </Panel>
        <Panel header="Card Section" defaultExpanded>
          <List bordered>
            {cardsList.map((ci) => {
              return <List.Item key={`${ci.cardId}@${ci.username}`}>
                <CardItem
                  cardId={ci.cardId}
                  cardnumber={ci.cardnumber}
                  username={ci.username}
                  holdername={ci.holdername}
                  handleRemove={handleCardRemoval}
                  handleView={handleCardView}
                />
              </List.Item>
            })}
            <List.Item>
              <FlexboxGrid justify="center">
                <FlexboxGrid.Item>
                  <IconButton appearance="primary" icon={<PlusIcon />} onClick={addCard}>New Card</IconButton>
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </List.Item>
          </List>
        </Panel>
        <Panel header="Identity Section" defaultExpanded>
          <List bordered>
            {identityList.map((ii) => {
              return <List.Item key={`${ii.username}`}>
                <IdentityItem
                  username={ii.username}
                  iname={ii.iname}
                  handleRemove={handleIdentityRemoval}
                  handleView={handleIdentityView}
                />
              </List.Item>
            })}
            <List.Item>
              <FlexboxGrid justify="center">
                <FlexboxGrid.Item>
                  <IconButton appearance="primary" icon={<PlusIcon />} onClick={addIdentity}>New Identity</IconButton>
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </List.Item>
          </List>
        </Panel>
      </PanelGroup>
      <Modal open={modalOpen} onClose={() => { handleModalClose(false) }}>
        <Modal.Header>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form formValue={selectedItem} onChange={setSelectedItem} >
            {selectedItem && Object.getOwnPropertyNames(selectedItem).map((property) => {
              const propType = getPropertyType(property);
              return (
                <Form.Group controlId={property} key={property} className={(propType === 'hidden' ? 'where-class' : '')}>
                  {propType !== 'hidden' && <Form.ControlLabel>{property}</Form.ControlLabel>}
                  {
                    (hideProperties.includes(property) && protectProperties && modalMode === 'view' ?
                      <span className="protection-val">{"*".repeat(selectedItem[property].length)}</span> :
                      <Form.Control
                        name={property}
                        type={propType}
                        disabled={noEditProperties.includes(property) && modalMode === 'view'}
                        autoComplete="off"
                        required={!notRequiredProperties.includes(property)}
                      />
                    )
                  }
                  {hideProperties.includes(property) && modalMode === 'view' &&
                    <IconButton
                      className="protection-icon"
                      icon={(protectProperties ? <VisibleIcon /> : <UnvisibleIcon />)}
                      onClick={toggleProtection}
                    />
                  }
                  {
                    !notRequiredProperties.includes(property) && propType !== 'hidden' &&
                    <Form.HelpText style={{ color: "red" }}>{property} is required</Form.HelpText>
                  }
                </Form.Group>
              )
            })}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => { handleModalClose(true) }} appearance="primary">
            {modalMode === 'view' ? 'Edit' : 'Add'}
          </Button>
          <Button onClick={() => { handleModalClose(false) }} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}