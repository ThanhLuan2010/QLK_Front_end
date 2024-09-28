// i18n/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    vi: {
      translation: {
        // Message
        FIELD_REQUIRED: "Trường này không được bỏ trống",
        NUMBER_REQUIRED: "Trường này phải là số",
        PHONE_REQUIRED: "Trường này phải là số điện thoại",
        ROLE_EXISTED: "Chức vụ đã tồn tại",

        // Message Team
        SUCCESS_ADD_EMPLOYEE: "Thêm nhân viên thành công",
        FAILURE_ADD_EMPLOYEE: "Thêm nhân viên thất bại",

        //other
        OT_BANGCHAMCONG: "Bảng chấm công",
        OT_CHOTCONG: "Chốt công",
        OT_HUYCONG: "Hủy công",
        OT_CSLDL: "Chọn số lượng dữ liệu sau đó bấm check",
        OT_KIEMTRASOGIODALAM: "Kiểm tra số giờ đã làm",
        OT_NHANVIENDANGHI: "Nhân viên đã nghỉ",
        OT_TAOBANGCHAMCONG: "Tạo bảng chấm công",
        OT_GIOVAO: "Giờ vào",
        OT_GIORA: "Giờ ra",
        OT_TONGSOGIOLAM: "Tổng số giờ làm",
        OT_NGAYCHAMCONG: "Ngày chấm công",
        OT_KHOIPHUCNV: "Khôi phục",
        OT_HESO: "Hệ số",
        //
        QLNV: "Quản lý nhân viên",
        QLCNHANH: "Quản lý chi nhánh",
        QLK: "Quản lý kho",
        TT: "Thông tin",
        BDTK: "Biến động tồn kho",
        QLNK: "Quản lý nhập kho",
        QLXK: "Quản lý xuất kho",
        DT: "Doanh thu",
        QLHD: "Quản lý hóa đơn",
        QLDT: "Quản lý doanh thu",
        QLCN: "Quản lý công nợ",
        HV: "Hành vi",
        NK: "Nhập kho",
        XK: "Xuất kho",
        TKCT: "Tồn kho công ty",
        TSTLN: "Tổng số tiền lợi nhuận nhập kho",
        //BUTTON
        BTN_XACNHAN: "Xác nhận",
        BTN_DONG: "Đóng",
        //TEAM
        LBNH: "Tên ngân hàng - Số ngân hàng",
        TITLETEAM: "Thông tin nhân viên",
        DESTEAM: "Quản lý các thành viên tại cửa hàng",
        TTNH: "Số ngân hàng",
        THEMNV: "Thêm nhân viên",
        TENNH: "Tên ngân hàng",
        XOANV: "Xóa nhân viên",
        SUANV: "Điều chỉnh",
        CN: "Chi nhánh",
        MNV_TEAM: "Mã nhân viên",
        TNV_TEAM: "Tên nhân viên",
        SDT_TEAM: "Số điện thoại",
        CV_TEAM: "Chức vụ",
        NV_TEAM: "Ngày vào",
        TDT_TEAM: "Thời điểm tạo",
        ALERT_THEMNHANVIEN_TEAM: "Nhân viên đã được thêm thành công",
        QLMCC: "Quản lý máy chấm công",
        NGAYBD: "Ngày bắt đầu",
        NGAYKT: "Ngày kết thúc",
        TONGSOGIOLAM: "TÍNH TỔNG SỐ GIỜ LÀM",
        KIEMTRASOGIOLAM: "KIỂM TRA SỐ GIỜ LÀM",
        ADD_ROLE: "Thêm chức vụ",
        //BRANCH
        CTTONGQUAN: "Chi tiết tổng quan chi nhánh",
        TITLEBRANCH: "Chi nhánh",
        DESBRANCH: "Quản lý các thông tin chi nhánh",
        STT_B: "Số thứ tự",
        MA_B: "Mã chi nhánh",
        TEN_B: "Tên chi nhánh",
        DIACHI_B: "Địa chỉ",
        MASOTHUE_B: "Mã số thuế",
        THOIDIEMTAO_B: "Thời điểm tạo",

        //DETAILS BRANCH
        MA_KHO: "Mã kho",
        CT_NV: "Chi tiết nhân viên",
        CT_KHO: "Chi tiết kho",
        CT_NK: "Chi tiết nhập kho",
        CT_XK: "Chi tiết xuất kho",
        CT_HD: "Chi tiết hóa đơn",
        CT_DOANHTHU: "Chi tiết doanh thu",
        CT_CONNO: "Chi tiết nợ",
        THOIDIEMTAOPHIEU: "Thời điểm tạo phiếu",

        //KHO
        SANPHAMHONG: "Sản phẩm hỏng",
        TITLEKHO: "Tồn kho",
        DESKHO: "Quản lý tồn kho",
        MASP_P: "Mã sản phẩm",
        TEN_P: "Tên sản phẩm",
        LOAI_P: "Loại sản phẩm",
        HINHANH_P: "Hình ảnh",
        SOLUONG_P: "Số lượng",
        TINHTRANG_P: "Tình trạng",
        HANHVI_P: "Hành vi",
        THEMSP_P: "Thêm sản phẩm",
        XOASP_P: "Xóa sản phẩm",
        DIEUCHINHSP_P: "Điều chỉnh",
        ALERT_THEMSANPHAM_P: "Thêm sản phẩm thành công",

        //NHẬP KHO
        ERROR_PHIEU: "*Vui lòng chọn loại phiếu",
        ERROR_DATEFORM: "*Kiểu dữ liệu phải là YYYY-MM-DD",
        ERROR_DULIEU: "*chưa có dữ liệu, không thể gửi",
        TITLENHAPKHO: "Nhập kho",
        DESNHAPKHO: "Quản lý nhập kho",
        MAKHO_NP: "Mã phiếu lập",
        MTK_NP: "Mã tài khoản",
        TINHTRANG_NP: "Tình trạng",
        SOTIEN_NP: "Số tiền",

        NGAYLAPPHIEU_NP: "Ngày lập phiếu",
        NGAYCAPNHAT_NP: "Ngày cập nhật phiếu",
        SOLUONGSP_NP: "Số lượng nhập",
        BTN_XACNHANYEUCAU_NP: "Xác nhận yêu cầu",

        TITLE_ALERT_NP: "Cập nhật tình trạng",
        DES_ALERT_NP: "Chuyển trạng thái sang chấp thuận?",
        DES_ALERT_NP_H: "Chuyển trạng thái sang hủy yêu cầu?",
        CAPNHAT_NP: "Cập nhật thành công",
        CLICKNO_NP: "Bạn chọn không!",

        //Xuất KHO
        XOAPHIEUXUATKHO: "Xóa phiếu xuất kho",
        XACNHANYEUCAU: "Xác nhận yêu cầu",
        THUE: "Thuế",
        THANHTIEN: "Thành tiền",
        GHICHU: "Ghi chú",
        HUYYEUCAU: "Hủy yêu cầu",
        TITLEXUATKHO: "Xuất kho",
        DESXUATKHO: "Quản lý xuất kho",
        MAPX_PX: "Mã phiếu xuất",
        MAPN_PX: "Mã phiếu nhập",
        TONGTIEN_PX: "Tổng tiền",
        TINHTRANG_PX: "Tình trạng",
        NGAYLAP_PX: "Ngày lập phiếu",
        NGAYCAPNHAT_PX: "Ngày cập nhật",
        SOLUONGSP_PX: "Số lượng sản phẩm xuất",
        ALERT_LAPHOADONSUCCESS: "Xuất kho thành công",
        BTN_LAPHOADON: "Lập hóa đơn",
        MODAL_NOIBAN: "Nơi bán",
        MODAL_GIAMUA: "Giá mua",
        MODAL_NOIMUA: "Nơi mua",
        MODAL_GIABAN: "Giá bán",
        MODAL_NHAPNOIBAN: "Nhập nơi bán",
        MODAL_NHAPNOIMUA: "Nhập nơi mua",
        NNK: "Nhập ngoài kho",
        //Hóa đơn
        TITLEHOADON: "Hóa đơn",
        DESHOADON: "Chi tiết hóa đơn (đã từng mua) theo từng chi nhánh",
        MAHD_HD: "Mã hóa đơn",
        MATK_HD: "Mã tài khoản",
        NOIBAN_HD: "Nơi bán",
        GIABAN_HD: "Giá bán",
        GIAMUA_HD: "Giá mua",
        NGAYLAP_HD: "Ngày lập hóa đơn",
        //
        HINHANHTRC: "Hình ảnh mặt trước",
        HINHANHSAU: "Hình ảnh mặt sau",
        //DOANH THU
        CONNO: "Công nợ",
        TONGSOTIEN: "Tổng số tiền",
        SOTIENTRATUCONNO: "Số tiền đã trả",
        SOTIENDOANHTHU: "Số tiền doanh thu",
        DSNOXACNHANNHAPHANG: "Danh sách Công nợ xác nhận nhập hàng",
        TITLEDOANHTHU: "DOANH THU",
        DESDOANHTHU: "Chi tiết doanh thu từng cửa hàng",
        MADT_DT: "Mã doanh thu",
        MAKHO_DT: "Mã kho",
        SOTIEN_DT: "Số tiền doanh thu",
        NGAYLAP_DT: "Ngày lập phiếu",
        DSCONNO_DT: "Danh sách công nợ",

        //Công nợ DEBTOR
        LANCUOICAPNHATYYY: "Lần cuối cập nhật YYYY-MM",
        THOIDIEMLAP: "Thời điểm lập phiếu",
        TITLECONNO: "Danh sách nợ",
        DESCONNO: "Chi tiết Nợ của từng cửa hàng",
        MA_CN: "Mã phiếu nợ",
        CHUNO_CN: "Chủ nợ",
        THOIDIEMNO_CN: "Thời điểm nợ",
        SOTIENNO_CN: "Số tiền nợ",
        LANCUOICAPNHAT: "Lần cuối cập nhật",
        MODAL_DIEUCHINHTT: "Cập nhật số tiền nợ",
        MODAL_SOTIENNO: "Số tiền nợ",
        MODAL_SOTIENTHU: "Số tiền thu",
        BTN_CAPNHATSOTIEN: "Cập nhật số tiền",
        ALERT_CAPNHATSUCCESS: "Đã cập nhật vào doanh thu thành công ",

        //Nhập kho
        ERROR_PHIEU: "*Vui lòng chọn loại phiếu",
        ERROR_DATEFORM: "*Kiểu dữ liệu phải là YYYY-MM-DD",
        ERROR_DULIEU: "*chưa có dữ liệu, không thể gửi",

        TITLENHAP: "Gửi yêu cầu Nhập sản phẩm",
        TONGSOTIEN_NHAP: "Tổng số tiền",
        LOAIPHIEU_NHAP: "Loại phiếu",
        ALERT_TITLE: "Gửi đơn yêu cầu xác nhận",
        ALERT_DES: "Bạn có chắc sẽ gửi đơn",
        ALERT_CHU: "chứ?",
        ALERT_PHIEUNHAP: "Phiếu nhập",
        ALERT_PHIEUXUAT: "Phiếu xuất",
        ALERT_GUIYEUCAUSUCCESS: "Gửi yêu cầu nhập thành công",
        ERROR_NAME: "Vui lòng nhập Tên sản phẩm.",
        ERROR_ID: "Vui lòng nhập Mã sản phẩm.",

        ERROR_LOAI: "Vui lòng nhập Loại.",

        ERROR_SOLUONG: "Vui lòng nhập Số lượng.",

        ERROR_SOTIEN: "Vui lòng nhập Tên sản phẩm.",

        ERROR_HINH: "Vui lòng chọn một hình ảnh.",
        BTN_XOA: "Xóa",
        LABLE_NHAP: "Nhập",
        BTN_GUIYEUCAU: "Gửi yêu cầu",

        //LẬP PHIẾU XUẤT
        TITLEPHIEUXUAT: "Lập phiếu xuất kho",
        CN_XUAT: "Chi nhánh xuất",
        MAPHIEU_XUAT: "Mã phiếu",
        LABLE_XUAT: "Xuất",
        XUATSU_X: "Xuất sứ",
        ALERT_ADDPHIEUSUCCESS: "Thêm phiếu xuất thành công !!",

        //Doashboard
        TSOTIENDABAN: "TỔNG SỐ TIỀN ĐÃ BÁN",
        SOTIENTTE: "Số tiền thực tế",
        TSOTIENTHUCTETUNHAPKHO: "TỔNG SỐ TIỀN THỰC TẾ TỪ NHẬP KHO",
        TITLEDOASHBOARD: "Bảng điều khiển",
        TSOTIENTHUVETUBAN: "TỔNG SỐ TIỀN THU VỀ TỪ BÁN",
        DESDOASHBOARD: "Chào mừng tới bảng điều khiển",
        TONGDOANHTHU: "Tổng doanh thu",
        SOTIENLOINHUAN: "Số tiền lợi nhuận",
        TONGTIENMUA: "Tổng tiền mua",
        TONGQUAN: "TỔNG QUAN SỐ TIỀN",
        TONGQUANNO: "TỔNG QUAN NỢ",
        THOIDIEMNO: "Thời điểm nợ",
        SLDC: "Số lượng điều chỉnh",
        clickdouble: "Bấm 2 lần vào ảnh sẽ phóng to ảnh ở đây....",
        CostBuy: "TỔNG SỐ TIỀN NHẬP KHO",
        Notice: "Thông báo",

        TONGQUANBAN: "TỔNG QUAN SỐ TIỀN ĐÃ BÁN TỪ THÁNG 1 ~ 12 NĂM 2024",
        TONGQUANNHAP: "TỔNG QUAN SỐ TIỀN NHẬP KHO TỪ THÁNG 1 ~ 12 NĂM 2024",
        GMONTH: "Chọn tháng",
        Export: "Xuất dữ liệu",
        CCCD: "Căn cước công dân",
        CCCDF: "CCCD mặt trước",
        CCCDB: "CCCD mặt sau",
        Timekeep: "Chấm công nhân viên",
        Calendar: "Lịch check-in/check-out",
        MultiTime: "Chấm công nhiều ngày",
        SubmitTime: "Chốt công",
        Checkin: "CheckIn",
        Checkout: "CheckOut",
        Detail: "Thông tin chi tiết",
        Update: "Cập nhật",
        Find: "Tìm kiếm",
        AddBranch: "Thêm chi nhánh",
        TypeProduct: "Loại sản phẩm",
        DetailProduct: "Thông tin sản phẩm",
        MainTotal: "Tổng số tiền thực tế",
        Total: "Số tiền thực tế",
        FWarehouse: "Nhập từ kho",
        OWarehouse: "Nhập ngoài kho",
        Confirm: "Xác nhận",
        DetailProduct1: "Chi tiết sản phẩm",
        Del: "Xóa",
        Img: "Hình ảnh",
        REMAIN: "Số lượng còn trong kho",

        // statistical tracking
        TOTAL_OVERTIME: "Thời gian OT: ",
        TOTAL_MINUTES_CHECKIN_LATER: "Tổng số giờ đi trễ: ",
        TOTAL_MINUTES_MINUS: "Tổng số giờ bị trừ: ",
        TOTAL_TIME_PAYSLIP: "Số giờ theo ca làm: ",
        TOTAL_TIME_CHECKIN_LATER: "Số lần đi trễ: ",
        TOTAL_TIME_CHECKOUT_EARLY: "Số lần về sớm: ",
        TOTAL: "Tổng cộng: ",

        // Common
        EXPORT: "Xuất dữ liệu",
        MINUS: "phút",
        HOURS: "giờ",
        TOTAL_TIME: "lần",
        NOT_DATA: "Chưa có dữ liệu",
        SHIFT: "Ca",

        // Table Employee
        TABLE_DAY: "Ngày",
        TABLE_CHECKIN: "Thời gian vào",
        TABLE_CHECKOUT: "Thời gian ra",
        TABLE_MINUS: "Bị trừ",
      },
    },
    ko: {
      translation: {
        // Message
        FIELD_REQUIRED: "이 필드는 비워둘 수 없습니다",
        NUMBER_REQUIRED: "이 필드는 숫자여야 합니다",
        PHONE_REQUIRED: "이 필드는 전화번호여야 합니다",

        // Message Team
        SUCCESS_ADD_EMPLOYEE: "직원을 추가했습니다",
        FAILURE_ADD_EMPLOYEE: "더 많은 직원이 실패합니다",
        ROLE_EXISTED: "해당 위치가 이미 존재합니다",

        //other
        OT_BANGCHAMCONG: "출근부",
        OT_CHOTCONG: "결근",
        OT_HUYCONG: "취소 출근",
        OT_CSLDL: "데이터 양을 선택한 다음 체크를 누르세요",
        OT_KIEMTRASOGIODALAM: "근무 시간 확인",
        OT_NHANVIENDANGHI: "휴가한 직원",
        OT_TAOBANGCHAMCONG: "출근부 만들기",
        OT_GIOVAO: "출근 시간",
        OT_GIORA: "퇴근 시간",
        OT_HESO: "계수",
        OT_TONGSOGIOLAM: "총 근로 시간",
        OT_NGAYCHAMCONG: "출근일",
        OT_KHOIPHUCNV: "직원 복구",
        GHICHU: "메모",
        //
        HINHANHTRC: "앞면 사진",
        HINHANHSAU: "뒷면 사진",
        DES_ALERT_NP_H: "요청 취소로 상태 변경",
        Notice: "알림",
        CostBuy: "사용된 금액",
        clickdouble: "이미지를 두 번 클릭하면 이미지가 여기로 확대됩니다",
        SLDC: "조절 수량",
        TKCT: "회사 재고",
        QLNV: "인사 관리",
        QLCNHANH: "지점 관리",
        TENNH: "행 이름",
        QLK: "창고 관리",
        TT: "정보",
        BDTK: "재고 변동",
        QLNK: "입고 관리",
        QLXK: "출고 관리",
        DT: "매출",
        QLHD: "영수증 관리",
        QLDT: "매출 관리",
        QLCN: "채무 관리",
        HV: "행동",
        NK: "입고",
        XK: "출고",
        NNK: "창고 외부에서 들여오기",
        //BUTTON
        NGAYBD: "시작일",
        NGAYKT: "종료일",
        TONGSOGIOLAM: "근무 시간 총합 계산",
        KIEMTRASOGIOLAM: "근무 시간 확인",
        BTN_XACNHAN: "확인",
        BTN_DONG: "닫기",
        //TEAM
        LBNH: "은행 이름 - 은행 번호",
        TTNH: "은행 정보",
        TITLETEAM: "팀 정보",
        DESTEAM: "가게 구성원 관리",
        THEMNV: "직원 추가",
        XOANV: "직원 삭제",
        SUANV: "직원 정보 수정",
        CN: "지점",
        MNV_TEAM: "직원 코드",
        TNV_TEAM: "직원 이름",
        SDT_TEAM: "전화 번호",
        CV_TEAM: "직위",
        NV_TEAM: "입사일",
        TDT_TEAM: "생성 시간",
        ALERT_THEMNHANVIEN_TEAM: "직원이 성공적으로 추가되었습니다",
        QLMCC: "출퇴근 기록 관리",
        THOIDIEMTAOPHIEU: "전표 생성 시점",
        ADD_ROLE: "위치 추가",
        //BRANCH
        TITLEBRANCH: "지점",
        DESBRANCH: "지점 정보 관리",
        MA_B: "지점 코드",
        STT_B: "순서",
        TEN_B: "지점명",
        DIACHI_B: "주소",
        MASOTHUE_B: "세금 번호",
        THOIDIEMTAO_B: "생성 시간",

        //DETAILS BRANCH
        CTTONGQUAN: "지점 전체적인 상황 세부 정보",
        MA_KHO: "창고 코드",
        CT_NV: "직원 세부 사항",
        CT_KHO: "창고 세부 정보",
        CT_NK: "창고 입고 세부 정보",
        CT_XK: "창고 출고 세부 정보",
        CT_HD: "영수증 세부 정보",
        CT_DOANHTHU: "매출 세부 정보",
        CT_CONNO: "미수금 세부 정보",
        //KHO
        SANPHAMHONG: "고장 난 제품",
        TITLEKHO: "재고",
        DESKHO: "재고 관리",
        MASP_P: "상품 코드",
        TEN_P: "상품명",
        LOAI_P: "상품 종류",
        HINHANH_P: "이미지",
        SOLUONG_P: "수량",
        TINHTRANG_P: "상태",
        HANHVI_P: "행동",
        THEMSP_P: "상품 추가",
        XOASP_P: "상품 삭제",
        DIEUCHINHSP_P: "상품 조정",
        ALERT_THEMSANPHAM_P: "상품 추가 성공",

        //NHẬP KHO
        ERROR_PHIEU: "*전표 유형을 선택하십시오",
        ERROR_DATEFORM: "*데이터 유형은 YYYY-MM-DD여야 합니다",
        ERROR_DULIEU: "*데이터가 없어서 보낼 수 없습니다",

        THOIDIEMLAP: "전표 작성 시점",
        TITLENHAPKHO: "입고",
        DESNHAPKHO: "입고 관리",
        MAKHO_NP: "전표 코드",
        MTK_NP: "계정 번호",
        TINHTRANG_NP: "상태",
        SOTIEN_NP: "금액",
        NGAYLAPPHIEU_NP: "전표 작성일",
        NGAYCAPNHAT_NP: "전표 업데이트 일자",
        SOLUONGSP_NP: "입고 수량",
        BTN_XACNHANYEUCAU_NP: "요청 확인",
        TITLE_ALERT_NP: "상태 업데이트",
        DES_ALERT_NP: "상태를 승인으로 변경",
        CAPNHAT_NP: "업데이트 성공",
        CLICKNO_NP: "당신은 아니라고 선택하셨습니다!",
        REMAIN: "나머지 제품",
        //Xuất KHO
        XOAPHIEUXUATKHO: "출고 전표 삭제",
        XACNHANYEUCAU: "요청 확인",
        HUYYEUCAU: "요청 취소",
        TITLEXUATKHO: "출고",
        DESXUATKHO: "출고 관리",
        MAPX_PX: "출고 번호",
        MAPN_PX: "입고 번호",
        TONGTIEN_PX: "총액",
        TINHTRANG_PX: "상태",
        NGAYLAP_PX: "전표 작성일",
        NGAYCAPNHAT_PX: "전표 업데이트 일자",
        SOLUONGSP_PX: "출고 제품 수량",
        ALERT_LAPHOADONSUCCESS: "출고 성공",
        BTN_LAPHOADON: "영수증 작성",
        MODAL_NOIBAN: "판매처",
        MODAL_GIAMUA: "구매 가격",
        MODAL_NOIMUA: "구입처",
        MODAL_GIABAN: "판매 가격",

        MODAL_NHAPNOIBAN: "판매처 입력",
        MODAL_NHAPNOIMUA: "구입처 입력",

        //Hóa đơn
        TITLEHOADON: "영수증",
        DESHOADON: "각 지점별 구매한 영수증 세부 정보",
        MAHD_HD: "영수증 번호",
        MATK_HD: "계정 번호",
        NOIBAN_HD: "판매처",
        GIABAN_HD: "판매 가격",
        GIAMUA_HD: "구매 가격",
        NGAYLAP_HD: "영수증 작성일",

        //DOANH THU
        TONGSOTIEN: "총 금액",
        TITLEDOANHTHU: "매출",
        DESDOANHTHU: "매장별 매출 세부 정보",
        MADT_DT: "매출 번호",
        MAKHO_DT: "창고 코드",
        SOTIEN_DT: "매출 금액",
        NGAYLAP_DT: "전표 작성일",
        DSCONNO_DT: "미수금 목록",

        TITLECONNO: "미수금 목록",
        DESCONNO: "각 매장별 미수금 세부 정보",
        MA_CN: "미수금 번호",
        CHUNO_CN: "채무자",
        THOIDIEMNO_CN: "미수금 시간",
        SOTIENNO_CN: "미수금",
        LANCUOICAPNHAT: "마지막 업데이트",

        MODAL_DIEUCHINHTT: "미수금 금액 업데이트",
        MODAL_SOTIENNO: "미수금 금액",
        MODAL_SOTIENTHU: "수금 금액",

        BTN_CAPNHATSOTIEN: "금액 업데이트",

        ALERT_CAPNHATSUCCESS: "매출에 성공적으로 업데이트되었습니다",
        SOTIENTRATUCONNO: "대출에서 지불한 금액",
        SOTIENDOANHTHU: "매출 금액",
        DSNOXACNHANNHAPHANG: "입고 확인 대기 중인 미수금 목록",
        //NHẬP
        TITLENHAP: "제품 입고 요청 보내기",
        TONGSOTIEN_NHAP: "총 금액",
        LOAIPHIEU_NHAP: "전표 유형",
        ALERT_TITLE: "확인 요청서 보내기",
        ALERT_DES: "확인 요청을 보낼까요",
        ALERT_CHU: "맞아요?",
        ALERT_PHIEUNHAP: "입고 전표",
        ALERT_PHIEUXUAT: "출고 전표",
        ALERT_GUIYEUCAUSUCCESS: "입고 요청을 성공적으로 보냈습니다",
        ERROR_NAME: "제품 이름을 입력하세요.",
        ERROR_ID: "제품 이름을 입력하세요.",

        ERROR_LOAI: "종류를 입력하세요.",

        ERROR_SOLUONG: "수량을 입력하세요.",

        ERROR_SOTIEN: "제품 이름을 입력하세요.",

        ERROR_HINH: "이미지를 선택하세요.",
        BTN_XOA: "삭제",
        LABLE_NHAP: "입력",
        BTN_GUIYEUCAU: "요청 보내기",

        //phiếu xuất
        TITLEPHIEUXUAT: "출고 전표 작성",
        CN_XUAT: "지점 출고",
        MAPHIEU_XUAT: "전표 번호",
        LABLE_XUAT: "출고",
        XUATSU_X: "출처",
        ALERT_ADDPHIEUSUCCESS: "출고 전표 추가 성공 !!",

        //Doashboard
        TSOTIENDABAN: "총 판매 금액",
        SOTIENTTE: "실제 금액",
        TSOTIENTHUCTETUNHAPKHO: "입고 총 실제 금액",
        TSOTIENTHUVETUBAN: "판매를 통해 받은 총 금액",
        TITLEDOASHBOARD: "대시 보드",
        TSTLN: "창고 입고 이익 총액",
        DESDOASHBOARD: "대시 보드에 오신 것을 환영합니다",
        TONGDOANHTHU: "총 매출",
        SOTIENLOINHUAN: "순이익 금액",
        TONGTIENMUA: "총 구매 금액",
        TONGQUAN: "매출 전체적인 상황",
        TONGQUANNO: "전체적인 미수금 상황",
        THOIDIEMNO: "미수금 시기",

        //Công nợ DEBTOR
        LANCUOICAPNHAT: "최신 업데이트 YYYY-MM",
        //Công nợ DEBTOR
        CONNO: "미수금",
        LANCUOICAPNHATYYY: "최신 업데이트 YYYY-MM",

        TONGQUANBAN: "2024년 1월부터 12월까지 판매된 금액 총괄",
        TONGQUANNHAP: "2024년 1월부터 12월까지 입고된 금액 총괄",
        GMONTH: "월 선택",
        Export: "데이터 익스포트",
        CCCD: "신분증",
        CCCDF: "신분증 앞면",
        CCCDB: "신분증 뒤면",
        Timekeep: "직원 출퇴근 기록",
        Calendar: "체크인/체크아웃 스케줄",
        MultiTime: "여러 날의 출퇴근 기록",
        SubmitTime: "출퇴근 확인",
        Checkin: "체크인",
        Checkout: "체크아웃",
        Detail: "세부정보",
        Update: "업데이트",
        Find: "검색",
        AddBranch: "지점 추가",
        TypeProduct: "제품 종류",
        DetailProduct: "제품 정보",
        MainTotal: "실제 총 금액",
        Total: "실제 금액",
        FWarehouse: "창고에서 가져옴",
        OWarehouse: "외부에서 가져옴",
        Confirm: "확인",
        DetailProduct1: "제품 세부정보",
        Del: "삭제",
        Img: "이미지",

        // statistical tracking
        TOTAL_OVERTIME: "초과 근무 시간",
        TOTAL_MINUTES_CHECKIN_LATER: "지각 시간 총 분",
        TOTAL_MINUTES_MINUS: "초과 근무 시간",
        TOTAL_TIME_PAYSLIP: "총 시간",
        TOTAL_MINUTES_CHECKOUT_EARLY: "조기 퇴근 총 분",
        TOTAL_TIME_CHECKIN_LATER: "지각 총 시간",
        TOTAL_TIME_CHECKOUT_EARLY: "조기 퇴근 총 시간",
        TOTAL: "총계",

        // Common
        EXPORT: "조기 퇴근 총 시간",
        MINUS: "분",
        HOURS: "시간",
        TOTAL_TIME: "시간",
        NOT_DATA: "사용 가능한 데이터가 없습니다",
        SHIFT: "옮기다",

        // Table Employee
        TABLE_DAY: "낮",
        TABLE_CHECKIN: "입장 시간",
        TABLE_CHECKOUT: "타임아웃",
        TABLE_MINUS: "공제됨",
      },
    },
  },
  lng: "vi", // Ngôn ngữ mặc định là tiếng Việt
  fallbackLng: "vi",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
