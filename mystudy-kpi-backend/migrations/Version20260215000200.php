<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260215000200 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add user profile table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE profile (id VARCHAR(36) NOT NULL, user_id VARCHAR(36) NOT NULL, first_name VARCHAR(100) NOT NULL, last_name VARCHAR(100) NOT NULL, bio TEXT DEFAULT NULL, birth_date DATE DEFAULT NULL, birth_place VARCHAR(150) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX uniq_profile_user ON profile (user_id)');
        $this->addSql('ALTER TABLE profile ADD CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES app_user (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE profile DROP CONSTRAINT fk_profile_user');
        $this->addSql('DROP TABLE profile');
    }
}
