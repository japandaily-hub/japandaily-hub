"""
Japan Daily Hub — マルチエージェント戦略策定スクリプト
4つの専門エージェントが順番に協調して、ビジネス戦略を構造化する。

実行方法:
  set ANTHROPIC_API_KEY=sk-ant-xxxx   (Windows)
  python scripts/strategy_agents.py
"""

import os
import sys
from anthropic import Anthropic

api_key = os.environ.get("ANTHROPIC_API_KEY")
if not api_key:
    print("エラー: 環境変数 'ANTHROPIC_API_KEY' が設定されていません。")
    sys.exit(1)

client = Anthropic(api_key=api_key)
MODEL_NAME = "claude-3-5-sonnet-20241022"


def run_cowork_agents(issue_description: str) -> None:
    print(f"=== 課題の受付 ===\n{issue_description}\n")

    # 1. ITコンサルタント — 戦略・要件定義
    print("--- [1/4] 世界一のITコンサルタント が戦略を策定中... ---")
    consultant_system = (
        "あなたは世界最高峰のITコンサルタントです。提示された課題に対し、"
        "ビジネスモデルのボトルネックを特定し、解決に向けた『戦略要件』と『KPI』を"
        "構造化して定義してください。余計な挨拶は不要です。"
    )
    consultant_output = client.messages.create(
        model=MODEL_NAME, max_tokens=1500, system=consultant_system,
        messages=[{"role": "user", "content": issue_description}]
    ).content[0].text
    print(consultant_output + "\n")

    # 2. マーケター — 顧客獲得・市場戦略
    print("--- [2/4] 世界一のマーケター が市場戦略を構築中... ---")
    marketer_system = (
        "あなたは世界一のマーケターです。ITコンサルタントが策定した戦略要件を基に、"
        "ターゲット顧客のインサイトを突き、競合優位性を確保するための『マーケティング戦略』"
        "および『ユーザー獲得ギミック』を具体化してください。"
    )
    marketer_output = client.messages.create(
        model=MODEL_NAME, max_tokens=1500, system=marketer_system,
        messages=[{"role": "user", "content": f"【コンサルタントの戦略要件】\n{consultant_output}"}]
    ).content[0].text
    print(marketer_output + "\n")

    # 3. Webデザイナー — UX/UI・体験設計
    print("--- [3/4] 世界一のWebデザイナー がUX/UIを設計中... ---")
    designer_system = (
        "あなたは世界一のWebデザイナーです。ここまでのビジネス戦略とマーケティング戦略を"
        "最高の顧客体験に昇華させるための『UX/UIコンセプト』『画面遷移・コンポーネント構成』"
        "および『情緒的価値を生むビジュアル戦略』を提示してください。"
    )
    designer_output = client.messages.create(
        model=MODEL_NAME, max_tokens=1500, system=designer_system,
        messages=[{"role": "user", "content": f"【コンサル要件】\n{consultant_output}\n\n【マーケ戦略】\n{marketer_output}"}]
    ).content[0].text
    print(designer_output + "\n")

    # 4. プログラマー — 技術選定・アーキテクチャ
    print("--- [4/4] 世界一のプログラマー が実装設計を確定中... ---")
    programmer_system = (
        "あなたは世界一のプログラマーです。これまでの戦略・マーケ・デザインを具現化するために、"
        "最先端かつ堅牢な『技術スタックの選定』『システムアーキテクチャ（データ構造・API等）』"
        "および『実装時のセキュリティ・スケーラビリティ対策』を技術的断定を持って記述してください。"
    )
    programmer_output = client.messages.create(
        model=MODEL_NAME, max_tokens=2000, system=programmer_system,
        messages=[{"role": "user", "content": f"【マーケ戦略】\n{marketer_output}\n\n【デザイン設計】\n{designer_output}"}]
    ).content[0].text
    print(programmer_output + "\n")

    print("=== 全エージェントによる協調解決プロセスの完了 ===")


if __name__ == "__main__":
    target_issue = (
        "日本製品の海外向けアフィリエイト外販サイト『Japan Daily Hub』において、"
        "円安メリットを最大限に訴求しながら、英語圏（US/UK/AU）の海外ユーザーが"
        "日本の高品質商品（飲食・日用雑貨・衣料品）を安心して購入できる仕組みを構築する。"
        "現状は Astro 製静的サイト（GitHub Pages）で商品数が少なく、"
        "リピート購入・SEO・信頼獲得の仕組みが未整備。"
        "目標: 月間ユニークユーザー1万人・アフィリエイト月収50万円・リピート率30%以上を達成する。"
    )
    run_cowork_agents(target_issue)
