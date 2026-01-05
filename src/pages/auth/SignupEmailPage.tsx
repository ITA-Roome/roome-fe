import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthApi } from "../../api/auth";

export default function SignupEmailPage() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [nicknameLoading, setNicknameLoading] = useState(false);

  // 이메일 요건 : xxxxxx@xxx.xxx
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // 전화번호 요건 : 010-xxxx-xxxx (010-4자리-4자리)
  const phonePattern = /^010-\d{4}-\d{4}$/;
  // 비밀번호 요건: 영문/숫자/특수문자 포함 + 8자 이상
  const PASSWORD_REGEX =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};:'",.<>/?\\|`~]).{8,}$/;

  const LETTER_REGEX = /[A-Za-z]/;
  const NUMBER_REGEX = /\d/;
  const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_\-+=[\]{};:'",.<>/?\\|`~]/;

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [codeMessage, setCodeMessage] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isMatch, setIsMatch] = useState(true);

  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState("");

  // 닉네임 입력 확인 및 중복확인
  const handleCheckNickname = async () => {
    const trimmedNickname = nickname.trim();
    if (!trimmedNickname) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    setNicknameLoading(true);
    setNicknameMessage("");
    setNicknameChecked(false);

    try {
      const { data } = await AuthApi.checkNickname(trimmedNickname);

      if (!data.isSuccess) {
        setNicknameMessage(data.message ?? "닉네임 확인에 실패했습니다.");
        return;
      }

      if (data.data?.isExist) {
        setNicknameMessage("이미 사용 중인 닉네임입니다.");
        return;
      }

      setNicknameMessage("사용 가능한 닉네임입니다.");
      setNicknameChecked(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setNicknameMessage(
          error.response?.data?.message ?? "닉네임 확인에 실패했습니다.",
        );
      } else {
        setNicknameMessage("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setNicknameLoading(false);
    }
  };

  // 이메일 형식 확인
  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailVerified(false);
    setCodeMessage("");
    setVerifyCode("");
    setEmailError(
      value.length === 0 || EMAIL_REGEX.test(value)
        ? ""
        : "올바른 이메일 주소를 입력해주세요.",
    );
  };

  // 전화번호 형식 확인
  const handlePhoneChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 11);
    let formatted = digitsOnly;

    if (digitsOnly.length > 3 && digitsOnly.length <= 7) {
      formatted = `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
    } else if (digitsOnly.length > 7) {
      formatted = `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 7)}-${digitsOnly.slice(7)}`;
    }

    setPhone(formatted);

    if (formatted.length === 0) {
      setPhoneError("");
    } else if (phonePattern.test(formatted)) {
      setPhoneError("");
    } else {
      setPhoneError(
        "전화번호가 올바른 형식으로 입력되지 않았습니다. 다시 확인해주세요.",
      );
    }
  };

  // 이메일 인증하기
  // 인증하기 버튼 -> 이메일 유무 확인 -> (true) -> 이메일 다시 입력
  //                            -> (false) -> 인증번호 발송
  const handleRequestEmailVerification = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
      setEmailError("올바른 이메일 주소를 입력해주세요.");
      return;
    }

    setEmailLoading(true);
    setEmailVerified(false);
    setCodeMessage("");
    setVerifyCode("");

    try {
      // 1) 이메일 존재 여부 확인
      const { data: existData } = await AuthApi.checkEmailExists(trimmedEmail);
      if (existData.isSuccess && existData.data?.isExist) {
        setEmailError(
          "이미 존재하는 이메일입니다. 다른 이메일로 다시 시도해주세요.",
        );
        return;
      }

      // 2) 존재하지 않는 이메일이면 인증 코드 발송
      await AuthApi.requestEmailVerification({ email: trimmedEmail });
      alert("인증 코드를 보냈습니다.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.message ??
            "인증 코드 전송 중 오류가 발생했습니다.",
        );
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setEmailLoading(false);
    }
  };

  // 인증번호 확인
  const handleConfirmVerification = async () => {
    const trimmedEmail = email.trim();
    const trimmedCode = verifyCode.trim();
    if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
      setEmailError("올바른 이메일 주소를 입력해주세요.");
      return;
    }
    if (!trimmedCode) {
      setCodeMessage("인증번호를 입력해주세요.");
      return;
    }
    setCodeLoading(true);
    setCodeMessage("");
    try {
      const { data } = await AuthApi.confirmEmailVerification({
        email: trimmedEmail,
        emailVerificationCode: trimmedCode,
      });
      if (!data.isSuccess) {
        setCodeMessage(data.message ?? "인증번호가 올바르지 않습니다.");
        setEmailVerified(false);
        return;
      }
      setCodeMessage("인증이 완료되었습니다.");
      setEmailVerified(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setCodeMessage(
          error.response?.data?.message ??
            "인증번호 확인 중 오류가 발생했습니다.",
        );
      } else {
        setCodeMessage("알 수 없는 오류가 발생했습니다.");
      }
      setEmailVerified(false);
    } finally {
      setCodeLoading(false);
    }
  };

  // 비밀번호 일치 확인
  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPasswordConfirm(value);
    setIsMatch(value === password);
  };

  // 비밀번호 입력 시 형식 및 일치 여부 확인
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextPassword = e.target.value;
    setPassword(nextPassword);
    // 입력 즉시 형식 검사 (8자 이상 + 영문 + 숫자 + 특수문자)
    if (nextPassword.length === 0) {
      setPasswordError("");
    } else {
      const missing: string[] = [];
      if (nextPassword.length < 8) missing.push("8자 이상");
      if (!LETTER_REGEX.test(nextPassword)) missing.push("영문");
      if (!NUMBER_REGEX.test(nextPassword)) missing.push("숫자");
      if (!SPECIAL_CHAR_REGEX.test(nextPassword)) missing.push("특수문자");

      if (missing.length > 0) {
        setPasswordError(`다음 요건을 만족해주세요: ${missing.join(", ")}`);
      } else {
        setPasswordError("");
      }
    }

    // 비밀번호가 바뀌면 확인란과 다시 비교해 일치 여부를 최신화
    setIsMatch(passwordConfirm === nextPassword);
  };

  // 회원가입 버튼 클릭
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 닉네임 공백 여부 확인
    const trimmedNickname = nickname.trim();
    if (!trimmedNickname) {
      setNicknameMessage("닉네임을 입력해주세요.");
      return;
    }

    // 닉네임 중복 확인이 끝났는지 체크
    if (!nicknameChecked) {
      setNicknameMessage("닉네임 중복 확인을 완료해주세요.");
      return;
    }

    // 이메일 형식 검사
    const trimmedEmail = email.trim();
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setEmailError("올바른 이메일 주소를 입력해주세요.");
      return;
    }

    // 이메일 인증 완료 여부 확인
    if (!emailVerified) {
      setCodeMessage("이메일 인증을 완료해주세요.");
      return;
    }

    // 전화번호 형식 검사
    if (!phonePattern.test(phone)) {
      setPhoneError(
        "전화번호가 올바른 형식으로 입력되지 않았습니다. 다시 확인해주세요.",
      );
      return;
    }

    // 비밀번호 형식 검사 (8자 이상 + 영문 + 숫자 + 특수문자)
    if (!PASSWORD_REGEX.test(password)) {
      setSignupError(
        "비밀번호 형식이 올바르지 않습니다. 영문, 숫자, 특수문자를 포함해 8자 이상 입력해주세요.",
      );
      return;
    }

    // 비밀번호와 확인란 일치 여부 검사
    if (!isMatch) {
      setSignupError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // API 요청 시작 상태 처리
    setSignupLoading(true);
    setSignupError("");

    try {
      // 회원가입 API 호출
      const { data, status } = await AuthApi.signup({
        email: trimmedEmail,
        nickname: trimmedNickname,
        password,
        phoneNumber: phone,
      });

      // 201이면 성공 처리
      if (status === 201 && data.isSuccess) {
        alert("회원가입이 완료되었습니다. 로그인해 주세요.");
        navigate("/");
        return;
      }

      // 201이 아니거나 isSuccess가 false인 경우 서버 메시지 표시
      setSignupError(
        data.message ?? "회원가입에 실패했습니다. 다시 시도해주세요.",
      );
    } catch (error) {
      // axios 에러만 선별해 응답 코드별로 메시지 분기
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;

        // 400: 비밀번호 형식 불일치 또는 이메일 미인증
        if (status === 400) {
          setSignupError(
            data?.message ??
              "비밀번호 형식이 올바르지 않거나 이메일 인증이 완료되지 않았습니다.",
          );
          return;
        }

        // 409: 이미 존재하는 이메일
        if (status === 409) {
          setSignupError(data?.message ?? "이미 등록된 이메일입니다.");
          return;
        }

        // 그 외 코드 : 공통 에러 처리
        setSignupError(
          data?.message ?? "회원가입에 실패했습니다. 다시 시도해주세요.",
        );
        return;
      }

      // 인터셉터에서 Error로 변환된 경우 메시지를 그대로 노출
      if (error instanceof Error && error.message) {
        setSignupError(error.message);
        return;
      }

      // 네트워크/기타 알 수 없는 에러
      setSignupError("알 수 없는 오류가 발생했습니다.");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {/* 회원가입 카드 컨테이너 */}
      <div className="text-center w-full max-w-sm">
        {/* 회원가입 폼 */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 px-2.5 text-left"
        >
          {/* 닉네임 */}
          <div className="relative">
            <label className="block text-[#5D3C28] text-sm mb-1">닉네임</label>
            <div className="relative">
              <input
                type="text"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setNicknameChecked(false);
                  setNicknameMessage("");
                }}
                placeholder="닉네임을 입력해주세요"
                className="w-full h-[50px] pl-3 pr-24 border border-[#5D3C28] rounded-3xl bg-white focus:outline-none focus:ring-2 focus:ring-[#5D3C28] placeholder-[#8D7569]"
              />
              <button
                type="button"
                onClick={handleCheckNickname}
                disabled={nicknameLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#8D7569] text-white text-sm px-3 py-1 rounded-3xl disabled:opacity-60"
              >
                {nicknameLoading ? "확인 중..." : "중복 확인"}
              </button>
            </div>
            {nicknameMessage && (
              <p
                className={`text-xs mt-1 ${
                  nicknameChecked ? "text-green-600" : "text-red-500"
                }`}
              >
                {nicknameMessage}
              </p>
            )}
          </div>

          {/* 이메일 */}
          <div className="relative">
            <label className="block text-[#5D3C28] text-sm mb-1">
              이메일 주소
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="ID@example.com"
                className={`w-full h-[50px] pl-3 pr-24 border rounded-3xl bg-white focus:outline-none focus:ring-2 ${
                  emailError
                    ? "border-red-500 focus:ring-red-400"
                    : "border-[#5D3C28] focus:ring-[#5D3C28]"
                } placeholder-[#8D7569]`}
              />
              <button
                type="button"
                onClick={handleRequestEmailVerification}
                disabled={emailLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#8D7569] text-white text-sm px-3 py-1 rounded-3xl"
              >
                {emailLoading ? "발송 중..." : "인증하기"}
              </button>
            </div>
            {emailError && (
              <p className="text-red-500 text-xs mt-1">{emailError}</p>
            )}
          </div>

          {/* 인증번호 */}
          <div className="relative">
            <label className="block text-[#5D3C28] text-sm mb-1">
              인증번호
            </label>
            <div className="relative">
              <input
                type="text"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                placeholder="인증번호 입력"
                className="w-full h-[50px] pl-3 pr-20 border border-[#5D3C28] rounded-3xl bg-white focus:outline-none focus:ring-2 focus:ring-[#5D3C28] placeholder-[#8D7569]"
              />
              <button
                type="button"
                onClick={handleConfirmVerification}
                disabled={codeLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#8D7569] text-white text-sm px-3 py-1 rounded-3xl"
              >
                {codeLoading ? "확인 중..." : "확인"}
              </button>
            </div>
            {codeMessage && (
              <p
                className={`text-xs mt-1 ${
                  emailVerified ? "text-green-600" : "text-red-500"
                }`}
              >
                {codeMessage}
              </p>
            )}
          </div>

          {/* 전화번호 */}
          <div>
            <label className="block text-[#5D3C28] text-sm mb-1">
              전화번호
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="전화번호"
              className="w-full h-[50px] p-3 border border-[#5D3C28] rounded-3xl bg-white focus:outline-none focus:ring-2 focus:ring-[#5D3C28] placeholder-[#8D7569]"
            />
            {phoneError && (
              <p className="text-red-500 text-xs mt-1">{phoneError}</p>
            )}
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-[#5D3C28] text-sm mb-1">
              비밀번호{" "}
              <span className="text-xs">
                (최소 8자 이상 / 영문, 숫자, 특수문자 포함)
              </span>
            </label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="비밀번호"
              className="w-full h-[50px] p-3 border border-[#5D3C28] rounded-3xl bg-white focus:outline-none focus:ring-2 focus:ring-[#5D3C28] placeholder-[#8D7569]"
            />
            {passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="block text-[#5D3C28] text-sm mb-1">
              비밀번호 확인
            </label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={handleConfirmChange}
              placeholder="비밀번호 확인"
              className={`w-full h-[50px] p-3 border rounded-3xl bg-white focus:outline-none focus:ring-2 ${
                isMatch
                  ? "border-[#5D3C28] focus:ring-[#5D3C28]"
                  : "border-red-500 focus:ring-red-400"
              } placeholder-[#8D7569]`}
            />
            {!isMatch && passwordConfirm.length > 0 && (
              <p className="text-red-500 text-xs mt-1">
                비밀번호가 일치하지 않습니다.
              </p>
            )}
          </div>

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            disabled={signupLoading}
            className="w-full h-[50px] mt-2 bg-[#D3C6BC] text-[#5D3C28] font-medium rounded-3xl disabled:opacity-60"
          >
            {signupLoading ? "가입 중..." : "회원가입"}
          </button>

          {signupError && (
            <p className="mt-2 text-center text-sm text-red-500">
              {signupError}
            </p>
          )}
        </form>

        {/* 로그인 문구 */}
        <p className="text-center text-sm text-[#5D3C28] mt-4">
          이미 ROOME 회원이라면?{" "}
          <Link
            to="/login" // 로그인 페이지로 이동
            className="text-[#5D3C28] font-semibold hover:underline hover:text-[#3E271B]"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
