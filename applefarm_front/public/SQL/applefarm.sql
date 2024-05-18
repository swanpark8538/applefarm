--ȸ�� ���̺�
CREATE TABLE MEMBER_TBL (
	MEMBER_NO	                NUMBER		        PRIMARY KEY,
	MEMBER_NAME	                VARCHAR2(30)		NOT NULL,
	MEMBER_NICKNAME	            VARCHAR2(30)		NOT NULL    UNIQUE,
	MEMBER_ID	                VARCHAR2(30)		NOT NULL    UNIQUE,
	MEMBER_PW	                CHAR(60)		    NOT NULL,
	MEMBER_EMAIL	            VARCHAR2(100)		NOT NULL,
	MEMBER_PHONE	            CHAR(13)		    NOT NULL,
	MEMBER_GRADE	            NUMBER		        NOT NULL,           -- 1:�����???  2:������  // 3: ��(�Խñ� �� �ı�, ���??? �ۼ� ����-1��)
	MEMBER_ACCOUNTNUMBER	    VARCHAR2(20)		NULL,
	ENROLL_DATE	                DATE		        NOT NULL,
	SELLER_SCORE	            NUMBER		        NOT NULL,           -- 0~100 ����. ���� 37��.
	SELLER_GRADE	            NUMBER		        NOT NULL,           --(1~3) ���������� ������ �ΰ�
	MEMBER_WITHDRAW	            CHAR(1)		        NOT NULL            -- 0 : ����ȸ�� /1: Ż��ȸ�� ��1�� ���??? �ش� �������� �α��� ����
);
CREATE SEQUENCE MEMBER_SEQ;

--�ּ����̺�
CREATE TABLE ADDRESS_TBL (
	ADDRESS_NO	            NUMBER		        PRIMARY KEY,
	MEMBER_NO	            NUMBER		        NOT NULL    REFERENCES MEMBER_TBL,
	ZIPCODE	                CHAR(5)		        NOT NULL,
	ADDRESS	                VARCHAR2(200)		NOT NULL,
	ADDRESS_DETAIL	        VARCHAR2(100)		NULL,
	ADDRESS_NAME	        VARCHAR2(30)		NOT NULL,
	ADDRESS_PHONE	        CHAR(13)		    NOT NULL,
	ADDRESS_REQUEST	        VARCHAR2(200)		NULL,
	ADDRESS_DEFAULT	        NUMBER		        NOT NULL        -- 1:�⺻�����???
);
CREATE SEQUENCE ADDRESS_SEQ;


--��ǰ ���̺�
CREATE TABLE PRODUCT_TBL (
	PRODUCT_NO	                NUMBER		            PRIMARY KEY,
	MEMBER_NO	                NUMBER		            NOT NULL        REFERENCES MEMBER_TBL,
	PRODUCT_QUALITY	            CHAR(1)		            NOT NULL,
	PRODUCT_TITLE	            VARCHAR2(100)		    NOT NULL,
	PRODUCT_EXPLAIN	            VARCHAR2(4000)		    NULL,
	PRODUCT_PRICE	            NUMBER		            NOT NULL,
	PRODUCT_DATE	            DATE		            NOT NULL,
	PRODUCT_HIDE                CHAR(1)                 NOT NULL,       -- 0 : �����ֱ�, 1: �����???
	PRODUCT_LINE	            VARCHAR2(100)		    NOT NULL,
	PRODUCT_GEN	                VARCHAR2(100)		    NULL,
	PRODUCT_MODEL	            VARCHAR2(100)		    NULL,
	PRODUCT_MODEL2	            VARCHAR2(100)		    NULL,
    PRODUCT_COLOR               VARCHAR2(100)           NULL,
	PRODUCT_STORAGE	            VARCHAR2(100)		    NULL,
	PRODUCT_MEMORY	            VARCHAR2(100)		    NULL,
	PRODUCT_CHIP	            VARCHAR2(100)		    NULL,
    PRODUCT_CPU                 VARCHAR2(100)           NULL,
    PRODUCT_GPU                 VARCHAR2(100)           NULL,
	PRODUCT_SIZE	            VARCHAR2(100)		    NULL,
	PRODUCT_CONNECTIVITY	    VARCHAR2(100)		    NULL,
	PRODUCT_CHARGE	            VARCHAR2(100)		    NULL,
    PRODUCT_THUMBNAIL	        VARCHAR2(100)		    NULL,
	PRODUCT_SUMMARY	            VARCHAR2(300)		    NOT NULL        -- EX) iPhone 15 Pro Max 256GB ȭ��Ʈ
);
CREATE SEQUENCE PRODUCT_SEQ;



--��ǰ ÷������ ���̺�
CREATE TABLE PRODUCT_FILE_TBL (
	FILE_NO	            NUMBER		        PRIMARY KEY,
	PRODUCT_NO	        NUMBER		        NOT NULL        REFERENCES PRODUCT_TBL,
	FILE_NAME	        VARCHAR2(100)		NOT NULL,
	FILE_PATH	        VARCHAR2(100)		NOT NULL
);
CREATE SEQUENCE PRODUCT_FILE_SEQ;


--�ŷ����̺�
CREATE TABLE TRADE_TBL (
	TRADE_NO	                NUMBER		            PRIMARY KEY,
	TRADE_SELLER	            NUMBER		            NOT NULL        REFERENCES MEMBER_TBL,
	TRADE_BUYER	                NUMBER		            NOT NULL        REFERENCES MEMBER_TBL,
	PRODUCT_NO	                NUMBER		            NOT NULL        REFERENCES PRODUCT_TBL,     -- PRODUCT_TBL�̶� JOIN�ؼ� RPODUCT_SUMMARY �����;� ��. ��ǰ�� ���� �����ִ� �뵵
	TRADE_RESERVE_DATE          DATE                    NULL,               -- TRADE_STATE = "������"�� ���� ��������
    TRADE_DATE	                DATE    		        NULL,
	TRADE_PRICE	                NUMBER		            NOT NULL,
	TRADE_STATE	                VARCHAR2(30)		    NOT NULL,           -- ������, �����Ϸ�, �߼۴��???, �����???,  ��ۿϷ�???, ����Ȯ�� or ȯ��
	ZIPCODE	                    CHAR(5)		            NOT NULL,
	ADDRESS	                    VARCHAR2(200)		    NOT NULL,
	ADDRESS_DETAIL	            VARCHAR2(100)		    NULL,
	ADDRESS_NAME	            VARCHAR2(30)		    NOT NULL,
	ADDRESS_PHONE	            CHAR(13)		        NOT NULL,
	ADDRESS_REQUEST	            VARCHAR2(200)		    NOT NULL,
	INVOICE_NUMBER	            VARCHAR2(30)		    NULL,                -- �����ڰ� �����Ϸ��� �Ǹ��ڰ� �ǸŹ�ǰ �ù躸���鼭 ���???
	PAYMENT_NUMBER				NUMBER					NULL,
	DELIVERY_DATE 				DATE 					NULL
);
CREATE SEQUENCE TRADE_SEQ;
alter table trade_tbl drop constraint SYS_C007894;--trade_date�÷��� not null �������� ����

--��ǰ�� �ż�ȣ�� ���̺�
CREATE TABLE BID_TBL (
	BID_NO	                NUMBER		    PRIMARY KEY,
	PRODUCT_NO	            NUMBER		    NOT NULL        REFERENCES PRODUCT_TBL,
	MEMBER_NO	            NUMBER		    NOT NULL        REFERENCES MEMBER_TBL,      -- ������
	BID_PRICE	            NUMBER		    NOT NULL
	BID_DATE 				DATE 			NOT NULL
);
CREATE SEQUENCE BID_SEQ;



--���ƿ� ���̺�
CREATE TABLE LIKE_TBL (
	LIKE_NO	            NUMBER		    PRIMARY KEY,
	MEMBER_NO	        NUMBER		    NOT NULL    REFERENCES MEMBER_TBL,
	PRODUCT_NO	        NUMBER		    NOT NULL    REFERENCES PRODUCT_TBL
);
CREATE SEQUENCE LIKE_SEQ;


--�ı� ���̺�
CREATE TABLE REVIEW_TBL (
	TRADE_NO	                NUMBER		        NOT NULL    REFERENCES TRADE_TBL,
	REVIEW_SELLER	            NUMBER		        NOT NULL    REFERENCES MEMBER_TBL,
	REVIEW_CONSUMER	            NUMBER		        NOT NULL    REFERENCES MEMBER_TBL,
	PRODUCT_NO	                NUMBER		        NOT NULL    REFERENCES PRODUCT_TBL,
	REVIEW_SATISFACTION	        NUMBER		        NOT NULL,       -- -1:�Ҹ���, 0:����, 1:����
	REVIEW_DETAIL	            VARCHAR2(3000)		NULL
);


--���� ���̺�
CREATE TABLE NOTE_TBL (
	NOTE_NO	                    NUMBER		            PRIMARY KEY,
	SENDER_MEMBER_NO	        NUMBER		            NOT NULL        REFERENCES MEMBER_TBL,  --������ ȸ����ȣ
	RECEIVER_MEMBER_NO	        NUMBER		            NOT NULL        REFERENCES MEMBER_TBL,  --�޴��� ȸ����ȣ
	PRODUCT_NO	                NUMBER		            NULL            REFERENCES PRODUCT_TBL,
	NOTE_TITLE	                VARCHAR2(200)		    NOT NULL,
	NOTE_CONTENT	            VARCHAR2(2000)		    NOT NULL,
	SEND_DATE	                DATE		            NOT NULL,
	RECEIVE_DATE	            DATE		            NOT NULL,
	RECEIVER_READ	            CHAR(1)		            NOT NULL,       -- 0(����x) / 1(����)   �����̰� �о�����
	RECEIVER_DELETE	            CHAR(1)		            NOT NULL,       -- 0(����x) / 1(����)   �����̰� �����ߴ���
	SENDER_DELETE	            CHAR(1)		            NOT NULL        -- 0(����x) / 1(����)   �����̰� �����ߴ���
);
CREATE SEQUENCE NOTE_SEQ;


----------------------��ǰ�����̺�---------------------------
--������
CREATE TABLE IPHONE_TBL (
	PRODUCT_LINE	        VARCHAR2(100)		    NOT NULL,
	PRODUCT_GEN	            VARCHAR2(100)		    NOT NULL,
	PRODUCT_MODEL	        VARCHAR2(100)		    NOT NULL,
	PRODUCT_COLOR	        VARCHAR2(100)		    NOT NULL,
	PRODUCT_IMAGE	        VARCHAR2(500)		    NOT NULL,
	PRODUCT_STORAGE	        VARCHAR2(100)		    NOT NULL
);
--�ƺ�
CREATE TABLE MACBOOK_TBL (
	PRODUCT_LINE	        VARCHAR2(100)		    NOT NULL,
	PRODUCT_GEN	            VARCHAR2(100)		    NOT NULL,
	PRODUCT_MODEL	        VARCHAR2(100)		    NOT NULL,
    PRODUCT_MODEL2	        VARCHAR2(100)		    NULL,
	PRODUCT_COLOR	        VARCHAR2(100)		    NOT NULL,
	PRODUCT_IMAGE	        VARCHAR2(500)		    NOT NULL,
	PRODUCT_STORAGE	        VARCHAR2(100)		    NOT NULL,
	PRODUCT_MEMORY	        VARCHAR2(100)		    NOT NULL,
	PRODUCT_CHIP	        VARCHAR2(500)		    NULL,
    PRODUCT_CPU 	        VARCHAR2(500)		    NULL,
    PRODUCT_GPU 	        VARCHAR2(500)		    NULL
);
--�����е�
CREATE TABLE IPAD_TBL (
	PRODUCT_LINE	        VARCHAR2(100)		    NOT NULL,
	PRODUCT_GEN	            VARCHAR2(100)		    NOT NULL,
	PRODUCT_COLOR	            VARCHAR2(100)		    NOT NULL,
	PRODUCT_IMAGE	            VARCHAR2(500)		    NOT NULL,
	PRODUCT_STORAGE	        VARCHAR2(100)		    NOT NULL,
	PRODUCT_CONNECTIVITY	    VARCHAR2(100)		    NOT NULL
);
--��ġ
CREATE TABLE WATCH_TBL (
	PRODUCT_LINE	        VARCHAR2(100)		NOT NULL,
	PRODUCT_GEN	            VARCHAR2(100)		NOT NULL,
	PRODUCT_MODEL	            VARCHAR2(100)		NOT NULL,
	PRODUCT_COLOR	            VARCHAR2(100)		NOT NULL,
	PRODUCT_IMAGE	            VARCHAR2(500)		NOT NULL,
	PRODUCT_SIZE	            VARCHAR2(100)		NOT NULL,
	PRODUCT_CONNECTIVITY	    VARCHAR2(100)		NOT NULL
);

--������
CREATE TABLE AIRPODS_TBL (
	PRODUCT_LINE	        VARCHAR2(100)		NOT NULL,
	PRODUCT_GEN	            VARCHAR2(100)		NOT NULL,
	PRODUCT_COLOR	        VARCHAR2(100)		NOT NULL,
	PRODUCT_IMAGE	        VARCHAR2(500)		NOT NULL,
	PRODUCT_CHARGE	        VARCHAR2(100)		NOT NULL
);
--����
CREATE TABLE COLOR_TBL (
	color	            VARCHAR2(100)		NOT NULL,   -- JOIN USING COLOR
	colorImage	        VARCHAR2(300)		NOT NULL    -- IMAGE FILE'S NAME
);

-------------------------------------------------------------------

--�Խ��� ���̺�
CREATE TABLE BOARD_TBL (
	BOARD_NO	            NUMBER		        PRIMARY KEY,
	BOARD_TITLE	            VARCHAR2(100)		NOT NULL,
	BOARD_CONTENT	        VARCHAR2(4000)		NOT NULL,
	MEMBER_NO	            NUMBER		        NOT NULL    REFERENCES MEMBER_TBL,
	READ_COUNT	            NUMBER		        NOT NULL,
	BOARD_TYPE	            NUMBER		        NOT NULL,     -- 1.��������, 2.�����Խ���, 3.�����Խ���, 4.�˳���, 5.�Ű���
	PRODUCT_CATEGORY	    VARCHAR2(50)		NULL,         -- IPHONE,  MACBOOK,  IPAD,  APPLEWATCH,  AIRPODS
	BOARD_HIDE	            CHAR(1)		        NOT NULL,     -- 0 : �����ֱ�, 1 : �����???
	BOARD_DATE	            DATE        		NOT NULL,
    BOARD_THUMBNAIL         VARCHAR2(100),
);
CREATE SEQUENCE BOARD_SEQ;

--���??? ���̺�
CREATE TABLE COMMENT_TBL (
	COMMENT_NO	            NUMBER		        PRIMARY KEY,
	BOARD_NO	            NUMBER		        NOT NULL    REFERENCES BOARD_TBL,
	COMMENT_WRITER	        NUMBER		        NULL        REFERENCES MEMBER_TBL,
	COMMENT_CONTENT	        VARCHAR2(500)		NOT NULL,
	SELF_REF	            NUMBER		        NULL        REFERENCES COMMENT_TBL,   --NULL: ���???, NULL x: ����
	COMMENT_HIDE	        CHAR(1)		        NOT NULL,   -- 0 : �����ֱ�, 1 : �����???
	COMMENT_DATE	        DATE    		    NOT NULL
);
CREATE SEQUENCE COMMENT_SEQ;

--�Խ��� ÷������ ���̺�
CREATE TABLE BOARD_FILE_TBL (
	FILE_NO	                NUMBER		        PRIMARY KEY,
	BOARD_NO	            NUMBER		        NOT NULL    REFERENCES BOARD_TBL,
	FILE_NAME	            VARCHAR2(300)		NOT NULL,
	FILE_PATH	            VARCHAR2(300)		NOT NULL
);
CREATE SEQUENCE BOARD_FILE_SEQ;

--ȯ�Ұ��� ���̺�
CREATE TABLE REFUND_TBL (
	REFUND_NO	            NUMBER		        PRIMARY KEY,
	TRADE_NO	            NUMBER		        NOT NULL    REFERENCES TRADE_TBL,
    PRODUCT_NO              NUMBER              NOT NULL    REFERENCES PRODUCT_TBL,     -- PRODUCT_TBL�̶� JOIN�ؼ� RPODUCT_SUMMARY �����;� ��. ��ǰ�� ���� �����ִ� �뵵
	REFUND_DATE	            DATE		        NOT NULL,
	REFUND_REASON	        VARCHAR2(2000)		NOT NULL,
	REFUND_STATUS	        NUMBER		        NULL    --��û,������(0), �ݷ�(->����Ȯ��, 1) , ����(2)
);
CREATE SEQUENCE REFUND_SEQ;

--�Ű����̺�
CREATE TABLE REPORT_TBL (
	REPORT_NO	            NUMBER		        PRIMARY KEY,
	REPORT_TYPE	            NUMBER		        NOT NULL,       --1(��ǰ�Ǹű�), 2(��ǰ�ı�), 3(����), 4(����), 5(�˳���), 6(����,����,�˳�����)
	REPORT_TARGET	        NUMBER		        NOT NULL,       --�� ������ �°� PK�Ѱ��ֱ�.  (��ǰ�Ǹű�, ��ǰ�ı�, ����,����,�˳���, ���???)��ȣ
    REPORT_CONTENT	        VARCHAR2(1000)		NULL,           --�Ű������� ��Ÿ�� �� Ȱ��ȭ
	REPORT_DATE	            DATE    		    NOT NULL,
	REPORTING_MEMBER	    NUMBER		        NOT NULL    REFERENCES MEMBER_TBL,
	REPORTED_MEMBER	        NUMBER		        NOT NULL    REFERENCES MEMBER_TBL,
	REPORT_STATUS	        NUMBER		        NOT NULL,        --������(0), �ݷ�(1), ����(2)
	REPORT_ACTION_DATE		DATE				NULL
);
CREATE SEQUENCE REPORT_SEQ;

--�Ű� ���� ���� ���� ���̺�
CREATE TABLE REPORT_SELECT_REFERENCE_TBL(
    REPROT_SELECT_NO            NUMBER             PRIMARY KEY,    -- SEQ ���??? X. ���� �� ���� �����ϱ� ����
    REPROT_SELECT_CONTENT       VARCHAR2(100)      NOT NULL
);

--�Ű��� ���̺�
CREATE TABLE REPORT_SELECT_TBL (
	REPORT_NO	        NUMBER		    NOT NULL    REFERENCES REPORT_TBL,
	REPROT_SELECT_NO	NUMBER		    NOT NULL    REFERENCES REPORT_SELECT_REFERENCE_TBL
);


INSERT INTO REPORT_SELECT_REFERENCE_TBL VALUES(1,'�弳�� ����߾��');
INSERT INTO REPORT_SELECT_REFERENCE_TBL VALUES(2,'���??? ���������???');
INSERT INTO REPORT_SELECT_REFERENCE_TBL VALUES(3,'�ǽ��� �õ��߾��???');
INSERT INTO REPORT_SELECT_REFERENCE_TBL VALUES(4,'������ǰ�� �Ǹ��߾��???');
INSERT INTO REPORT_SELECT_REFERENCE_TBL VALUES(5,'�ҹ�Ȱ���� �ǽɵǾ��???');
INSERT INTO REPORT_SELECT_REFERENCE_TBL VALUES(6,'�Ұ����� ������ �ۼ��Ǿ����???');
INSERT INTO REPORT_SELECT_REFERENCE_TBL VALUES(7,'�������??? ���??? ����߾��');

COMMIT;




--ADD TABLE COLUMNS
ALTER TABLE MEMBER_TBL ADD (MEMBER_BLACK_TIME TIMESTAMP);
ALTER TABLE PRODUCT_TBL ADD TABLE_NAME VARCHAR(50);
ALTER TABLE REPORT_TBL ADD (REPORT_ACTION_DATE DATE);



--ADD TABLE
CREATE TABLE CHAT_ROOM_TBL (
    ROOM_NO NUMBER PRIMARY KEY,
    ROOM_TITLE VARCHAR2(60) NOT NULL,
    PARTICIPANT1 VARCHAR2(30) NOT NULL REFERENCES MEMBER_TBL (MEMBER_ID) ON DELETE CASCADE,
    PARTICIPANT2 VARCHAR2(30) NOT NULL REFERENCES MEMBER_TBL (MEMBER_ID) ON DELETE CASCADE,
    ROOM_CREATE_TIME TIMESTAMP NOT NULL
);
CREATE SEQUENCE CHAT_ROOM_SEQ;

CREATE TABLE CHAT_MESSAGE_TBL (
    MESSAGE_NO NUMBER PRIMARY KEY,
    ROOM_NO NUMBER NOT NULL REFERENCES CHAT_ROOM_TBL (ROOM_NO) ON DELETE CASCADE,
    MESSAGE_SENDER VARCHAR2(30) NOT NULL REFERENCES MEMBER_TBL (MEMBER_ID) ON DELETE CASCADE,
    MESSAGE_RECEIVER VARCHAR2(30) NOT NULL REFERENCES MEMBER_TBL (MEMBER_ID) ON DELETE CASCADE,
    MESSAGE_CONTENT VARCHAR2(500) NOT NULL,
    MESSAGE_SEND_TIME TIMESTAMP NOT NULL
);
CREATE SEQUENCE CHAT_MESSAGE_SEQ;

-- BID_TBL
CREATE TABLE BID_TBL (
    BID_NO          NUMBER                          PRIMARY KEY,
    PRODUCT_NO      NUMBER          NOT NULL        REFERENCES PRODUCT_TBL ON DELETE CASCADE,
    MEMBER_NO       NUMBER          NOT NULL        REFERENCES MEMBER_TBL ON DELETE CASCADE,     --������
    BID_PRICE       NUMBER          NOT NULL
);
CREATE SEQUENCE BID_SEQ;

COMMIT;



