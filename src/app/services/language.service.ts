import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  public langsData = [
    {
      lang: 'vi',
      code: 'vn',
      pageNotFound: {
        notFound: true,
        name: 'Không tìm thấy trang nội dung!',
        title: 'Không tìm thấy trang nội dung!',
        mess: 'Trang nội dung này không tồn tại hoặc đã bị xóa.',
      },
      connectErr: {
        loading: false,
        err: true,
        title: 'Lỗi kết nối!',
        mess: 'Có lỗi xảy ra hoặc mất kết nối Internet.',
        retry: 'Tải lại'
      },
      loginResults: [
        {
          status: 'checking',
          mess: 'Đang truy cập vào tài khoản của bạn...',
          note: ''
        },
        {
          status: 'fail',
          mess: 'Đăng nhập thất bại',
          note: 'Có lỗi xảy ra, xin vui lòng thử lại!'
        },
        {
          status: 'userNotFound',
          mess: 'Đăng nhập thất bại',
          note: 'User này không tồn tại hoặc đã bị xóa!'
        },
        {
          status: 'userDisabled',
          mess: 'Đăng nhập thất bại',
          note: 'User này đã bị hủy!'
        },
        {
          status: 'userLocked',
          mess: 'Đăng nhập thất bại',
          note: 'User này đã bị Khóa!'
        },
        {
          status: 'changedPassword',
          mess: 'Đăng nhập thất bại',
          note: 'Mật khẩu của bạn đã bị thay đổi!'
        },
        {
          status: 'wrongPassword',
          mess: 'Đăng nhập thất bại',
          note: 'Mật khẩu không đúng!'
        },
        {
          status: 'userNotActive',
          mess: 'Tài khoản của bạn chưa được kích hoạt!',
          note: 'Mã kích hoạt đã được gửi vào Email của bạn ngay khi khởi tạo User. Hãy nhập mã kích hoạt vào đây để đăng nhập!'
        }
      ],
      userOrPassWrong: 'Username hoặc mật khẩu không đúng!',
      noAdminPermission: 'Bạn không có quyền quản trị trang này!',
      processing: 'Đang xử lý yêu cầu của bạn',
      doNotCloseBrowser: 'Xin đừng tắt trình duyệt cho đến khi quá trình xử lý thành công!',
      processErr: 'Có lỗi xảy ra, xin vui lòng thử lại sau!',
      processDone: 'Gửi yêu cầu thành công!',
      updateSuccess: 'Cập nhật nội dung thành công!',
      sameCat: 'Bài viết cùng danh mục',
      updated: 'Cập nhật',
      author: 'Người đăng',
      citeSource: 'Trích nguồn',
      readMore: 'Xem thêm',
      learnMore: 'Tìm hiểu thêm',
      viewAll: 'Xem tất cả',
      send: 'Gửi',
      retry: 'Thử lại',
      cancel: 'Hủy',
      close: 'Đóng',
      genders: [
        {
          value: 'm',
          title: 'Nam'
        }, {
          value: 'f',
          title: 'Nữ'
        }
      ],
      titles: [
        { value: 'mr', title: 'ông' },
        { value: 'mrs', title: 'bà' },
        { value: 'ms', title: 'cô' },
        { value: 'miss', title: 'cô' }
      ],
      saleOff: 'Khuyến mãi',
      discount: 'Giảm giá',
      priceOnly: 'Giá chỉ còn',
      from: 'từ',
      to: 'đến',
      dateFormat: 'dd/MM/yyyy',
      visitors: 'Lượt truy cập',
      visitings: 'Đang truy cập'
    }, {
      lang: 'en',
      code: 'gb',
      pageNotFound: {
        notFound: true,
        name: 'Page not found!',
        title: 'Page not found!',
        mess: 'This page does not exist or has been deleted.',
      },
      connectErr: {
        loading: false,
        err: true,
        title: 'Connection error!',
        mess: 'Something went wrong or broke the internet.',
        retry: 'Reload'
      },
      loginResults: [
        {
          status: 'checking',
          mess: 'Connecting to your account...',
          note: ''
        },
        {
          status: 'fail',
          mess: 'Login Fail',
          note: 'Something went wrong, please try again!'
        },
        {
          status: 'userNotFound',
          mess: 'Login Fail',
          note: 'This User does not exist or has been removed!'
        },
        {
          status: 'userDisabled',
          mess: 'Login Fail',
          note: 'This User has been disabled!'
        },
        {
          status: 'userLocked',
          mess: 'Login Fail',
          note: 'This User has been locked!'
        },
        {
          status: 'changedPassword',
          mess: 'Login Fail',
          note: 'Your password has been changed!'
        },
        {
          status: 'wrongPassword',
          mess: 'Login Fail',
          note: 'Password is not right!'
        },
        {
          status: 'userNotActive',
          mess: 'Your User has not been activated!',
          note: 'The activation code has been sent to your email when the user has just been created. Please enter the activation code here to Sign in!'
        }
      ],
      userOrPassWrong: 'Username or password is not right!',
      noAdminPermission: "You do'nt have permission to manage this page!",
      processing: 'Processing your request',
      doNotCloseBrowser: 'Please do not close the browser until processing is successful!',
      processErr: 'Something went wrong, please try again later!',
      processDone: 'Request sent successfully!',
      updateSuccess: 'Update successfully!',
      sameCat: 'Articles of the same category',
      updated: 'Updated',
      author: 'Author',
      citeSource: 'Source',
      readMore: 'Read more',
      learnMore: 'Learn more',
      viewAll: 'View all',
      send: 'Send',
      retry: 'Retry',
      cancel: 'Cancel',
      close: 'Close',
      genders: [
        {
          value: 'm',
          title: 'Male'
        }, {
          value: 'f',
          title: 'Feemale'
        }
      ],
      titles: [
        { value: 'mr', title: 'mr' },
        { value: 'mrs', title: 'mrs' },
        { value: 'ms', title: 'ms' },
        { value: 'miss', title: 'miss' }
      ],
      saleOff: 'Sale off',
      discount: 'Discount',
      priceOnly: 'Price only',
      from: 'from',
      to: 'to',
      dateFormat: 'MMM dd, yyyy',
      visitors: 'Visitors',
      visitings: 'Visitings'
    }
  ];

  constructor() { }

  public getLangData(lang: string) {
    var data = this.langsData.find(item => item.lang === lang);
    if (!data) {
      data = this.langsData[0];
    }
    return data;
  }

  public getLangContent(data: any[], lang: string) {
    const rs = data.find(item => item.lang === lang);
    if (rs) {
      return rs;
    }
    return data[0];
  }

  public getPageNotFound(lang: string) {
    return this.getLangData(lang).pageNotFound;
  }

  public getLoadingErr(lang: string) {
    var data = this.getLangData(lang).connectErr;
    data.loading = false;
    return data;
  }

  public getLangValue(data: any, lang: string) {
    if (!lang) { lang = 'vi' };
    if (data) {
      const arr = this.isArray(data).data;
      if (arr) {
        const rs = arr.find(item => item.lang === lang);
        if (rs) {
          return rs.content;
        } else {
          console.log({
            message: 'No data for language = ' + lang + '!',
            value: data
          })
          return null;
        }
      } else {
        return data;
      }
    } else {
      return null;
    }
  }

  public isJSON(value: any) {
    if (typeof value === 'string') {
      try {
        JSON.parse(value);
      } catch (error) {
        return null;
      }
      return JSON.parse(value);
    } else {
      return value;
    }
  }

  public isArray(value: any) {
    const JSON = this.isJSON(value);
    if (Array.isArray(JSON)) {
      return {
        data: JSON
      }
    } 
    return {
      data: [],
      err: 'Value is not a, Array',
      value: value
    };
  }

  public isObject(value: any) {
    const JSON = this.isJSON(value);
    if (JSON) {
      if (Array.isArray(JSON)) {
        return {
          err: 'Value is not an Object, it is a Array',
          value: JSON
        }
      }
      return JSON;
    } 
    return {
      err: 'Value is not a JSON',
      value: value
    }
  }

}
