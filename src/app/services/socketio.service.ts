import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  public messages = {
    userActions: {
      checkConnecting: 'check-user-conecting',
      login: 'user-login',
      isOnline: 'user-is-now-online',
      logout: 'user-logout',
      isOffline: 'user-is-offline',
      addUser: 'add-user',
      addMember: 'add-client-member',
      edited: 'edit-user',
      getUsersOnline: 'GET-USERDATA',
      receivedUsersOnline: 'EMIT-USERSDATA'
    },
    visitor: {
      getVisitorData: 'GET-VISITORS-DATA',
      receiveVisitorData: 'EMIT-VISITORS-DATA',
      visitorInfo: 'visitor-info', //Emit and receive
      newVisitor: 'newVisitor',
      updateVisitorId: 'update-visitor-id',
      changeViewUrl: 'visitor-change-url',
      updateData: 'visitor-update-data',
      loginChat: 'visitor-logout-chat',
      logoutChat: 'visitor-logout-chat'
    },
    emitLoginData: 'emitWebLoginData',
    emitLogOut: 'emitWebLogOut',
    updateAvatar: 'updateAvatar',
    updateCover: 'updateCover',
    updatePictures: 'updatePictures',
    appNotification: 'appNotification',
    domains: {
      new: 'addedNewWebDomain',
      edit: 'editedWebDomain',
      delete: 'deletedWebDomain',
      updateTables: 'updateWebDomainDbTables'
    },
    siteValues: {
      new: 'addNewWebsiteValue',
      edit: 'editedWebsiteValue',
      delete: 'deletedWebsiteValue'
    },
    menu: {
      new: 'addNewWebMenu',
      edit: 'editedWebMenu',
      delete: 'deletedWebMenu'
    },
    simplePage: {
      new: 'addNewWebPage',
      edit: 'editedWebPage',
      delete: 'deletedWebPage',
      updateContents: 'updateWebPageContents'
    },
    posts: {
      newCat: 'addedNewWebPostCat',
      editCat: 'editedWebPostCat',
      deleteCat: 'deletedWebPostCat',
      newPostManager: 'addedNewWebPostManager',
      editPostManager: 'editedWebPostManager',
      deletePostManager: 'deletedWebPostManager',
      newPostList: 'addedNewWebPostList',
      editPostList: 'editedWebPostList',
      deletePostList: 'deletedWebPostList',
      updateContents: 'updateWebPostContents'
    },
    reviews: {
      new: 'newCustomerReview',
      edit: 'editedCustomerReview',
      delete: 'deletedCustomerReview'
    },
    webContact: {
      new: 'newWebContact'
    },
    library: {
      newCat: 'addNewWebLiblaryCat',
      editCat: 'editedWebLiblaryCat',
      deleteCat: 'deletedWebLiblaryCat',
      newItem: 'addNewWebLiblaryItem',
      editItem: 'editedWebLiblaryItem',
      deleteItem: 'deletedWebLiblaryItem'
    },
    gallery: {
      new: 'uploaded_new_file_to_gallery',
      newFiles: 'uploaded_multi_files_to_gallery',
      remove: 'removed_a_picture_from_gallery',
      createAlbum: 'created_album',
      editAlbum: 'edited_album',
      deleteAlbum: 'deleted_album'
    },
    embedCodes: {
      new: 'addNewSiteEmbedCode',
      edit: 'editedSiteEmbedCode',
      delete: 'deletedSiteEmbedCode'
    },
    webSupports: {
      new: 'addNewWebSupportLine',
      edit: 'editedWebSupportLine',
      delete: 'deletedWebSupportLine'
    },
    newsSubscribe: {
      new: 'addNewSubscribeEmail',
      edit: 'editedSubscribeEmail',
      delete: 'deletedSubscribeEmail'
    },
    products: {
      newCat: 'addedNewProductCat',
      editCat: 'editedProductCats',
      deleteCat: 'deletedProductCats',
      newProd: 'addedNewProduct',
      editProd: 'editedProducts',
      deleteProd: 'deletedProducts',
      newPost: 'addedNewProductPost',
      editPost: 'editedProductPosts',
      deletePost: 'deletedProductPosts',
      updatePostContent: 'updatedProductPostContents',
      changeCatLevel: 'changedProductCatLevel'
    },
    promotions: {
      new: 'addedNewPromotions',
      edit: 'editedPromotions',
      delete: 'deletedPromotions'
    },
    orders: {
      new: 'createdWebOrder',
      edit: 'editedWebOrder',
      delete: 'deletedWebOrder'
    }
  }

  socket: SocketIOClient.Socket;
  baseUrl: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appService: AppService,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.baseUrl = this.appService.baseUrl;
      this.socket = io(this.baseUrl);
    }
  }

  public onConect() {
    console.log('Connected to to SocketIo server on ' + this.baseUrl);
  }

  public emit(message, data) {
    if (this.socket) {
      this.socket.emit(message, data);
    }
  }

  public on = (message): Observable<any> => {
    if (isPlatformBrowser(this.platformId)) {
      return Observable.create(observer => {
        this.socket.on(message, data => {
          observer.next(data);
        });
      });
    }
  }

}
