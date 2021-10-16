import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppService } from '../core/services/app.service';
import { CipherService } from '../core/services/cipher.service';
import { MessageService } from '../core/services/message.service';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  viewMessage: boolean = false;
  sentMessages: boolean = false;
  receivedMessages: boolean = false;
  messages: any = []
  userNameInput: any
  username: any = "johndoe";
  usersList: any = [];
  sendMessage: boolean = false;
  content: string = ""
  newConversation: boolean;
  user2: string = ""
  currentMessage: any = [];
  messageId: any;
  currentReceivedMessage: any = [];
  downloadJsonHref: any;
  fileName: string = `download_${new Date().getTime()}.txt`;
  isDownloadReady: boolean = false;
  polling: any;

  constructor(
    private messageService: MessageService,
    private appService: AppService,
    private userService: UserService,
    private router: Router,
    private cipherService: CipherService,
    private zone: NgZone,
    private domSanitizer: DomSanitizer
    ) {
      this.username = this.appService.getUserName()
     }

  ngOnInit() {
    this.getAllUsers()  
    this.getMessages()
    //polling for getting new messages
    this.polling = setInterval(() => {
      // this.getAllUsers()  
      this.getMessages()
    }, 10*1000)
  }

  getMessages() {
    this.messageService.getMessages()
    .subscribe((res) => {
      console.log("Message list", res)
      this.zone.run(() => {
        this.messages = res
      })
    })
  }

  getAllUsers() {
    this.userService.getAllUsers()
      .subscribe((users)=> {
        console.log("users", users)
        this.usersList = users
      })
  }

  generateDownloadJsonUri(res) {
    // var theJSON = JSON.stringify(res);
    var theJSON = res.dbDumpData;
    var uri = this.domSanitizer.bypassSecurityTrustUrl("data:text/plain;charset=UTF-8," + encodeURIComponent(theJSON));
    this.fileName = `download_${new Date().getTime()}.txt`
    this.downloadJsonHref = uri;
    this.isDownloadReady = true;
}

  dbDump() {
    this.messageService.getdbDump()
      .subscribe((res) => {
        this.generateDownloadJsonUri(res)
      }, (err) => {
        console.log("error" ,err)
      })
  }

  disableLink() {
    setTimeout(() => {
      this.isDownloadReady = false
    }, 2000)
  }

  viewSentMessages() {
    this.sentMessages = true;
    this.receivedMessages = false;
    this.viewMessage = true;
    this.sendMessage = false;
  }

  viewReceivedMessages() {
    this.sentMessages = false;
    this.receivedMessages = true;
    this.viewMessage = true;
    this.sendMessage = false;
  }

  back() {
    this.sentMessages = false;
    this.receivedMessages = false;
    this.viewMessage = false;
    this.sendMessage = false;
    this.currentMessage = []
    this.currentReceivedMessage = []
    this.user2 = null
    this.newConversation = false;
  }

  selectMessage(event) {
    //todo
    let a = event.target.value
    console.log("Select Message", a, this.messages)
      this.user2 = a
      let conversation = this.messages.filter(m => m.users.includes(a) && m.users.includes(this.username))
      console.log("conv", conversation)
      if(conversation.length){
        this.newConversation = false
        this.selectConversation(conversation[0])
      }
      else {
        this.newConversation = true
        this.sendMessage = true;
        this.currentMessage = [];
      }
      console.log("selectMessage newConversation", this.newConversation)
  }

  selectConversation(msg) {
    console.log("selectConversation", msg)
    this.messageId = msg._id
    this.user2 = this.showUserId(msg)
    this.newConversation = false
    this.sendMessage = true;
    this.currentMessage = [];
    msg.messages[this.username].forEach(async (m) => {
      console.log("a m", m)
      let data = await this.cipherService.decryptMessage(m).toPromise()
      console.log("data", data)
      this.currentMessage.push(data);
      // .subscribe((plainText) => {
      //     this.currentMessage.push(plainText);
      //   })
    })
    console.log(this.currentMessage, this.username, msg.messages)
  }

  selectReceivedConversation(msg) {
    console.log("selectConversation", msg)
    this.messageId = msg._id
    this.user2 = this.showUserId(msg)
    this.newConversation = false
    msg.messages[this.user2].forEach(async (m) => {
      console.log("a m", m)
      let data = await this.cipherService.decryptMessage(m).toPromise()
      console.log("data", data)
      this.currentReceivedMessage.push(data);
      // .subscribe((plainText) => {
      //     this.currentMessage.push(plainText);
      //   })
    })
    console.log(this.currentMessage, this.user2, msg.messages)
  }

  showUser(msg) {
    let user = msg.users.filter(u => u !== this.username)[0] || ""
    if(user) {
      let name = this.usersList.filter(u => user === u._id)[0] || ""
      return name? name["username"]: ""
    }
    return;
  }

  showUserId(msg) {
    return msg.users.filter(u => u !== this.username)[0] || ""
  }

  sendToUser() {
    console.log("content", this.content)
    if(this.content) {
      this.cipherService.encryptMessage(this.content)
        .subscribe((encryptedData) => {
          this.messageService.sendMessage(encryptedData, this.newConversation, this.user2, !this.newConversation? this.messageId: null)
            .subscribe((res) => {
              console.log("Message sent successfully", res)
              this.content = ""
            })
        })
    }
  }


  logout() {
    this.userService.logout()
    this.router.navigate(["login"])
  }

  ngOnDestroy() {
    clearInterval(this.polling);
    console.log("home component destroyed")
  }

}
